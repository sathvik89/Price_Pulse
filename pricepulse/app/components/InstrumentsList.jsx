"use client";
//rendering the supa base instruments list ...
export default function InstrumentsList({ instruments }) {
  if (!instruments?.length)
    return <p className="text-gray-400">No instruments found.</p>;

  return (
    <ul className="mt-8 space-y-3 text-gray-200">
      {instruments.map(({ id, name, type, price }) => (
        <li
          key={id}
          className="bg-gray-700 rounded-md p-3 hover:bg-gray-600 transition-colors"
        >
          <strong className="text-blue-400">{name}</strong> — {type} —{" "}
          <span className="text-green-400">${price}</span>
        </li>
      ))}
    </ul>
  );
}
