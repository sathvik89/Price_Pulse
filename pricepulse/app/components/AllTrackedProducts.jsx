// "use client";
// import { supabase } from "@/lib/supabaseClient";
// import { useEffect, useState } from "react";
// // import { supabase } from "../lib/supabaseClient";

// const AllTrackedProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         const { data, error } = await supabase
//           .from("tracked_products")
//           .select("*")
//           .order("created_at", { ascending: false });

//         if (error) throw error;
//         setProducts(data);
//       } catch (error) {
//         console.error("error fetching products:", error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   if (loading) {
//     return <p className="text-gray-400">loading products...</p>;
//   }
//   if (!products.length) {
//     return <p className="text-gray-400">no products tracked yet</p>;
//   }

//   return (
//     <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//       {products.map((product) => (
//         <div
//           key={product.id}
//           className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
//         >
//           {product.image_url && (
//             <img
//               src={product.image_url}
//               alt={product.title || "product image"}
//               className="w-full h-48 object-contain mb-3 rounded"
//             />
//           )}
//           <h3 className="font-medium text-blue-400 truncate">
//             {product.title || "Untitled Product"}
//           </h3>
//           <p className="text-green-400 text-lg mt-2">{product.current_price}</p>
//           <a
//             href={product.url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-sm text-gray-300 hover:text-white mt-2 block truncate"
//           >
//             view product
//           </a>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AllTrackedProducts;
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AllTrackedProducts = ({ serverProducts }) => {
  const [products, setProducts] = useState(serverProducts || []);
  const [loading, setLoading] = useState(!serverProducts);

  useEffect(() => {
    // if we didn't get server products, fetch them
    if (!serverProducts) {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from("tracked_products")
            .select("*")
            .order("created_at", { ascending: false });

          if (error) throw error;
          setProducts(data);
        } catch (error) {
          console.error("error fetching products:", error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [serverProducts]);

  if (loading) {
    return <p className="text-gray-400">loading products...</p>;
  }
  if (!products.length) {
    return <p className="text-gray-400">no products tracked yet</p>;
  }

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
        >
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.title || "product image"}
              className="w-full h-48 object-contain mb-3 rounded"
            />
          )}
          <h3 className="font-medium text-blue-400 truncate">
            {product.title || "Untitled Product"}
          </h3>
          <p className="text-green-400 text-lg mt-2">{product.current_price}</p>
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-300 hover:text-white mt-2 block truncate"
          >
            view product
          </a>
        </div>
      ))}
    </div>
  );
};

export default AllTrackedProducts;
