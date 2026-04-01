import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, amount, orderName } = body;

    // 주문 ID 생성
    const orderId = `order_${courseId}_${Date.now()}`;

    // 토스페이먼츠 결제 위젯 URL 생성
    // 실제 연동 시 토스페이먼츠 SDK를 프론트엔드에서 사용하는 것을 권장합니다.
    // 이 API는 결제 확인(confirm) 용도로 사용됩니다.

    return NextResponse.json({
      orderId,
      amount,
      orderName,
      // 클라이언트에서 토스페이먼츠 SDK로 결제창을 띄울 때 사용할 정보
      clientKey: process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY,
    });
  } catch {
    return NextResponse.json(
      { error: "결제 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 결제 확인 (토스페이먼츠 confirm)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    const secretKey = process.env.TOSS_SECRET_KEY;
    const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString("base64");

    const response = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${encryptedSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentKey, orderId, amount }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "결제 확인에 실패했습니다." },
        { status: 400 }
      );
    }

    // 결제 성공 - DB에 결제 정보 저장 로직 추가 가능
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { error: "결제 확인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
