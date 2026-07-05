import { AIConversationMemory } from "../memory";
import { db } from "lib/db";

jest.mock("lib/db");

describe("AIConversationMemory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create conversation record", async () => {
    (db.conversation.create as jest.Mock).mockResolvedValue({
      id: "convo-1",
      userId: "user-1",
      title: "Career Advice",
    });

    const convo = await AIConversationMemory.createConversation("user-1", "Career Advice");
    expect(convo.id).toBe("convo-1");
    expect(db.conversation.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { userId: "user-1", title: "Career Advice" },
      })
    );
  });

  it("should append messages inside transactions", async () => {
    (db.message.create as jest.Mock).mockResolvedValue({
      id: "msg-1",
      content: "Hello AI",
    });

    const msg = await AIConversationMemory.appendMessage("convo-1", "user", "Hello AI");
    expect(msg.content).toBe("Hello AI");
    expect(db.message.create).toHaveBeenCalled();
    expect(db.conversation.update).toHaveBeenCalled();
  });
});
