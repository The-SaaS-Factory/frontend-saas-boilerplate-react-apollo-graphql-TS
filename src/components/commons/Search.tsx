const Search = (props: { refresh: (variables: any) => void }) => {
  const handleChange = (e: any) => {
    const searchValue = e.target.value;
    props.refresh({ search: searchValue });
  };

  return (
    <div className="mb-3">
      <div>
        <div className="relative  flex items-center">
          <input
            type="text"
            name="search"
            id="search"
            placeholder={"Search "}
            onChange={handleChange}
            className="block px-3 w-full rounded-md border-0 py-1.5 pr-14 text bg-main shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset   sm:text-sm sm:leading-6"
          />
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
