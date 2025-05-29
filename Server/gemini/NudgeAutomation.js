import { ai } from "./config.js";
import Nudge from "../Models/NudgeModel.js";
import { User } from "../Models/UserModel.js";

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
