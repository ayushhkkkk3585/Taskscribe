import dbConnect from "@/lib/mongodb";
import Meeting from "@/models/Meeting";
import Task from "@/models/Task";
import User from "@/models/User";
import { GoogleGenAI } from "@google/genai";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


const parseDeadline = (deadlineStr) => {
  if (!deadlineStr) return null;

  const date = new Date(deadlineStr);
  if (!isNaN(date.getTime())) {
    return date;
  }

  const [datePart, timePart] = deadlineStr.split(', ');
  if (datePart && timePart) {
    const [month, day, year] = datePart.split('/');
    const [time, period] = timePart.split(' ');
    const [hours, minutes, seconds] = time.split(':');

    let hour = parseInt(hours);
    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }

    const parsedDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      hour,
      parseInt(minutes),
      parseInt(seconds)
    );

    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  return null;
};

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { managerId, title, transcript, date, tags } = body;

    if (!managerId || !title || !transcript || !date) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Extract email mentions
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const mentionedEmails = transcript.match(emailRegex) || [];

    // Generate AI summary
    const prompt = `
Extract tasks and their assigned emails from this meeting transcript.
Only include tasks that have clear email assignments.
Format JSON strictly like:
{
  "summary": [
    {
      "description": "...",
      "assignedToEmail": "specific email from transcript",
      "deadline": "YYYY-MM-DD",
      "status": "pending"
    }
  ]
}

Consider these emails mentioned: ${mentionedEmails.join(', ')}

Transcript:
${transcript}
    `;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = result.text.trim();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse Gemini output:", text);
      parsed = { summary: [] };
    }

    // Create meeting
    const meeting = await Meeting.create({
      managerId,
      title,
      transcript: { text: transcript },
      date: new Date(date),
      tags,
      summary: [],
      tasks: [],
    });

    // Process tasks
    const summary = [];
    const taskCreationPromises = [];

    for (let task of parsed.summary || []) {
      if (!task.assignedToEmail) continue;

      const user = await User.findOne({ email: task.assignedToEmail.toLowerCase() });

      if (user) {
        const deadline = parseDeadline(task.deadline);

        const taskData = {
          meetingId: meeting._id,
          title: task.description,
          description: task.description,
          assignedTo: user._id,
          deadline: deadline,
          status: "pending",
        };

        taskCreationPromises.push(
          Task.create(taskData)
            .then(async (newTask) => {
              try {
                await resend.emails.send({
                  from: "Taskscribe <onboarding@resend.dev>",
                  to: user.email,
                  subject: `New Task Assignment: ${task.description}`,
                  html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                      <h2 style="color: #2563eb;">New Task Assignment</h2>
                      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
                        <h3 style="margin-top: 0;">${task.description}</h3>
                        <p><strong>Meeting:</strong> ${meeting.title}</p>
                        ${deadline ? `
                          <p><strong>Deadline:</strong> ${deadline.toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}</p>
                        ` : ''}
                        <p><strong>Status:</strong> Pending</p>
                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                          <p style="color: #4b5563; font-size: 14px;">
                            This task was automatically created from your meeting notes.
                          </p>
                        </div>
                      </div>
                    </div>
                  `
                });
              } catch (emailError) {
                console.error('Failed to send email:', emailError);
              }

              summary.push({
                description: task.description,
                assignedTo: user._id,
                assignedToEmail: task.assignedToEmail,
                deadline: deadline,
                status: "pending"
              });
              return newTask._id;
            })
            .catch(err => {
              console.error(`Failed to create task for ${task.assignedToEmail}:`, err);
              return null;
            })
        );
      }
    }

    const taskIds = (await Promise.all(taskCreationPromises)).filter(id => id !== null);

    meeting.tasks = taskIds;
    meeting.summary = summary;
    await meeting.save();

    return new Response(JSON.stringify({
      meeting,
      tasksCreated: taskIds.length,
      totalTasksAttempted: parsed.summary?.length || 0
    }), { status: 201 });

  } catch (err) {
    console.error("Meeting creation error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
