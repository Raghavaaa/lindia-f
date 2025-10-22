export default function Test() { return <div>{process.env.NEXT_PUBLIC_BACKEND_URL || "NOT SET"}</div>; }
