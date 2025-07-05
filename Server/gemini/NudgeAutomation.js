import { ai } from "./config.js";
import Nudge from "../Models/NudgeModel.js";
import { User } from "../Models/UserModel.js";
import { config } from "dotenv";

/**
 * Creates a new nudge in the database.
 * Throws an error if title, body, or creatorid is missing or invalid.
 */
export const create_nudge = async (title, body, creatorid) => {
    if (!title || !body || !creatorid) {
        throw new Error("Missing title, body, or creatorid.");
    }

    const user = await User.findById(creatorid);
    if (!user) {
        throw new Error("Invalid user: No user found with the provided email.");
    }

    const nudge = await Nudge.create({
        creatorId: creatorid,
        title,
        body,
        author: user.name,
        creatorId:user.email,
        profilephoto: user.profilephoto
    });

    return {
        status: "success",
        message: "Nudge created successfully",
        nudge
    };
};

// Function metadata declaration for Gemini
const createNudgeFunctionDeclaration = {
    name: "create_nudge",
    description: "Creates a new nudge using the provided title, body, and creator ID (email). The author name is fetched from the database.",
    parameters: {
        type: "object",
        properties: {
            title: {
                type: "string",
                description: "Short title summarizing the nudge."
            },
            body: {
                type: "string",
                description: "Main content/message of the nudge."
            },
            creatorid: {
                type: "string",
                description: "mongodb _id of the user creating the nudge."
            }
        },
        required: ["title", "body", "creatorid"]
    }
};

// Function map for dispatch
const functionMap = {
    create_nudge: async ({ title, body, creatorid }) =>
        await create_nudge(title, body, creatorid)
};

/**
 * Calls Gemini AI to generate or automate a nudge creation based on a user prompt.
 */
export const automateNudge = async (prompt) => {
    try {
        const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

       const result = await model.generateContent({
  contents: [
    {
      role: "user",
      parts: [{ text: prompt }]
    }
  ],
  systemInstruction: `
You are Zenith, a friendly chatbot for a platform called Zentra, where users share their daily thoughts in the form of short texts called nudges.

Your task is to read the user’s prompt and respond warmly and conversationally. If the prompt involves creating a nudge (e.g., “write my thought,” “post this,” or “my nudge is...”), you should:

- Generate a suitable title if one is not provided.
- Use the prompt content as the body of the nudge or refine it for clarity and tone.
- Call the appropriate function to create and post the nudge.
- Ensure your responses are friendly, empathetic, and aligned with the tone of a supportive thought-sharing platform.
    `.trim(),
  tools: [
    {
      functionDeclarations: [createNudgeFunctionDeclaration]
    }
  ]
});


const response = result.response;

// response.functionCalls is likely a function you need to call:
const functionCalls = response.functionCalls?.();

console.log("Function Calls:", functionCalls);
if (functionCalls && functionCalls.length > 0) {
            const { name, args } = functionCalls[0];

            if (functionMap[name]) {
                try {
                    const nudgeResult = await functionMap[name](args);
                    return {
                        status: "success",
                        message: "Function executed successfully",
                        result: nudgeResult
                    };
                } catch (err) {
                    return {
                        status: "error",
                        message: `Function execution failed: ${err.message}`
                    };
                }
            } else {
                return {
                    status: "error",
                    message: `Function "${name}" not found in functionMap.`
                };
            }
        }

        // ✅ If no function was called, fallback to text
        const textResponse = response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textResponse) {
            return {
                status: "success",
                message: "AI text response",
                text: textResponse
            };
        }

        return {
            status: "error",
            message: "AI response was empty or unrecognized."
        };
      }catch(error){
        console.log("error in automateNudge",error)
      }
};




export const Zenithchatt = async (prompt) => {
  try {
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `
        You are Zenith, an AI assistant chatbot for the Zentra community platform.
You will be provided with the name, description, full chat history of a specific community, and a question asked by a user.

🔒 Your Responsibilities:
Only answer questions that are strictly related to the community's topic (defined by its name and description) and its past chats.

If a question is unrelated, vaguely related, or outside the domain of the community (e.g., someone asks about backend in a frontend-only community), reply respectfully with:

"Sorry, I can only answer questions related to this community's topic: [Community Name and Description]. Please ask something within this scope."

Never reveal or use user personal details (e.g., name, profile picture, email) in any form.

Your tone should be helpful, friendly, and human-like — like a supportive community member.

✅ Example Scenarios:
If the community is "Frontend Developers", and someone asks "What is React?", respond helpfully.

If they ask "How does Node.js work?", respond with the polite refusal above.

If they ask "What happened today in this community?", summarize from chat history.

Always keep answers focused on the community's defined scope only ❌ If a question is off-topic, do not attempt to answer it. Instead, politely:

Say that the question is outside this community’s scope.

Suggest the actual domain or topic the question belongs to.

✅ For example:

If the community is about Frontend Development, and the user asks "What is Prisma?", respond like:

"That’s a great question, but it seems to be outside the scope of this community. Prisma is an ORM tool typically used in backend development with SQL databases. This question would be more suited for a backend or database-focused community.". Do not invent or assume knowledge beyond what's appropriate.
      `
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text || "Zenith could not respond.";
  } catch (error) {
    console.error("Zenith error:", error);
    return "Zenith is currently unavailable.";
  }
};
