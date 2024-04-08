function Article({ item, key }: { item: any; key: number }) {
  return (
    <div key={key} className="p-8">
      {/* Card */}
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        {/* Card Header */}
        <div className="bg-gray-100 p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
        </div>

        {/* Card Body */}
        <div className="p-4">
          <p className="text-gray-700">{item.summary}</p>
        </div>

        {/* Card Footer */}
        <div className="bg-gray-100 p-4 border-t border-gray-200">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-900"
          >
            {item.url}
          </a>
        </div>
      </div>
    </div>
  );
}

export default Article;
