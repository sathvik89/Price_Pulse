const ProductDetails = ({ product }) => {
  if (!product) return <div>Product not found</div>;

  // Format date
  const formattedDate = new Date(product.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-semibold text-blue-400 mb-4">
        product details
      </h2>

      {product.image_url && (
        <div className="mb-4 flex justify-center">
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.title || "Product image"}
            className="w-full max-w-[250px] h-auto object-contain rounded"
          />
        </div>
      )}

      <h3 className="text-xl font-medium text-white mb-2">
        {product.title || "Untitled Product"}
      </h3>

      <div className="mt-4 bg-gray-700 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300">current price:</span>
          <span className="text-2xl font-bold text-green-400">
            {product.current_price}
          </span>
        </div>

        {product.original_price &&
          product.original_price !== product.current_price && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">original price:</span>
              <span className="text-lg line-through text-gray-400">
                {product.original_price}
              </span>
            </div>
          )}

        <div className="flex justify-between items-center">
          <span className="text-gray-300">tracked since:</span>
          <span className="text-gray-300">{formattedDate}</span>
        </div>
      </div>

      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-500 transition-colors"
      >
        view on amazon
      </a>
    </div>
  );
};

export default ProductDetails;
