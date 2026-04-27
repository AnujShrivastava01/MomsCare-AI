import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || email.trim() === "") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const emailLower = email.toLowerCase();
    
    // Simple heuristic-based "AI" for demonstration
    let intent = "query";
    let urgency = "low";
    let escalate = false;
    const confidence = 0.9;
    let reasoning = "The customer is asking a general question about products.";
    let suggestedReplyEn = "Thank you for reaching out! We'd be happy to help you with your inquiry. Could you please provide more details?";
    let suggestedReplyAr = "شكراً لتواصلك معنا! يسعدنا مساعدتك في استفسارك. هل يمكنك تزويدنا بمزيد من التفاصيل؟";

    if (emailLower.includes("refund") || emailLower.includes("money back")) {
      intent = "refund";
      urgency = "medium";
      reasoning = "Customer is requesting a refund for a product.";
      suggestedReplyEn = "I understand you're looking for a refund. I've initiated the process and our billing team will review it shortly.";
      suggestedReplyAr = "أتفهم أنك تطلب استرداد المبلغ. لقد بدأت العملية وسيقوم فريق الحسابات لدينا بمراجعتها قريباً.";
    } else if (emailLower.includes("where is my") || emailLower.includes("not received") || emailLower.includes("delivery")) {
      intent = "delivery_issue";
      urgency = "medium";
      reasoning = "Customer is inquiring about the status of their delivery.";
      suggestedReplyEn = "I'm sorry for the delay in your delivery. Let me check the tracking status for you immediately.";
      suggestedReplyAr = "نعتذر عن التأخير في التوصيل. اسمح لي بالتحقق من حالة التتبع لك فوراً.";
    }

    if (emailLower.includes("angry") || emailLower.includes("upset") || emailLower.includes("disappointed") || emailLower.includes("immediate") || emailLower.includes("urgent")) {
      urgency = "high";
      escalate = true;
      reasoning += " The tone appears frustrated/urgent, requiring immediate attention.";
    }

    // Return the strict JSON format requested in the prompt
    return NextResponse.json({
      intent,
      urgency,
      reasoning,
      suggested_reply: {
        english: suggestedReplyEn,
        arabic: suggestedReplyAr
      },
      confidence,
      escalate
    });

  } catch (error) {
    console.error("Triage error:", error);
    return NextResponse.json({ error: "Failed to analyze email" }, { status: 500 });
  }
}
