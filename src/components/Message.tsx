export default function Message({ role, content }:{ role: "user"|"assistant"; content: string }){
  const isAssistant = role === "assistant";
  return (
  <div className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
  <div className={`${isAssistant?"bg-white text-gray-900":"bg-blue-600 text-white"} max-w-[80%] whitespace-pre-wrap px-4 py-2 rounded-2xl border`}>{content}</div>
  </div>
  );
}