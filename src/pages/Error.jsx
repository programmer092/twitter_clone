export default function Error() {
  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center bg-gray-800">
        <div className="max-w-md rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-3xl text-gray-800">
            Oops! Something went wrong...
          </h1>
          <p className="text-lg text-red-600">404: Not Found!</p>
        </div>
      </div>
    </>
  );
}
