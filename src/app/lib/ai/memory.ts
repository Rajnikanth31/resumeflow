import { db } from "lib/db";

export class AIConversationMemory {
  static async createConversation(userId: string, title = "New Chat") {
    return db.conversation.create({
      data: {
        userId,
        title,
      },
    });
  }

  static async getConversation(userId: string, conversationId: string) {
    return db.conversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  }

  static async listConversations(userId: string) {
    return db.conversation.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  static async appendMessage(
    conversationId: string,
    role: "system" | "user" | "assistant",
    content: string
  ) {
    return db.$transaction(async (tx) => {
      const msg = await tx.message.create({
        data: {
          conversationId,
          role,
          content,
        },
      });

      await tx.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      return msg;
    });
  }

  static async deleteConversation(userId: string, conversationId: string) {
    const convo = await db.conversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },
    });

    if (!convo) throw new Error("Conversation not found");

    await db.conversation.delete({
      where: {
        id: conversationId,
      },
    });

    return true;
  }
}
