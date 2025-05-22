// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Search from "./Search";

// const Form = () => {
//   const [url, setUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const trimmedUrl = url.trim();
//     if (!trimmedUrl) {
//       setError("please enter a url");
//       return;
//     }

//     if (!trimmedUrl.includes("amazon.")) {
//       setError("please enter a valid amazon url");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setSuccess(false);

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/scrape`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ url: trimmedUrl }),
//         }
//       );

//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.error || "failed to track product");
//       }

//       const result = await res.json();
//       setSuccess(true);
//       setUrl("");
//       // refresh the page to show new product
//       setTimeout(() => router.refresh(), 1000);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <form
//         onSubmit={handleSubmit}
//         className="flex justify-around items-center w-full border border-gray-600 rounded-lg overflow-hidden"
//       >
//         <input
//           type="url"
//           placeholder="enter amazon product url..."
//           className="w-full px-4 py-3 bg-transparent focus:outline-none placeholder:text-gray-400"
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//         />
//         <Search loading={loading} />
//       </form>
//       {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//       {success && (
//         <p className="text-green-500 text-sm mt-2">
//           product tracked successfully!
//         </p>
//       )}
//     </>
//   );
// };

// export default Form;
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Search from "./Search";

const Form = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError("please enter a url");
      return;
    }

    if (!trimmedUrl.includes("amazon.")) {
      setError("please enter a valid amazon url");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/scrape`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: trimmedUrl }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "failed to track product");
      }

      setSuccess(true);
      setUrl("");
      // Force a refresh of the data
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex justify-around items-center w-full border border-gray-600 rounded-lg overflow-hidden"
      >
        <input
          type="url"
          placeholder="enter amazon product url..."
          className="w-full px-4 py-3 bg-transparent focus:outline-none placeholder:text-gray-400"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Search loading={loading} />
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {success && (
        <p className="text-green-500 text-sm mt-2">
          product tracked successfully!
        </p>
      )}
    </>
  );
};

export default Form;
