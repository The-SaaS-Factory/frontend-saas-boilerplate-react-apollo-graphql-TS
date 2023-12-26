import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
import { TextInput } from "@tremor/react";

/* eslint-disable @typescript-eslint/no-explicit-any */
const Search = (props: { refresh: (variables: any) => void }) => {
  const handleChange = (value: string) => {
    const searchValue = value;
    props.refresh({ search: searchValue });
  };

  return (
    <div className="mb-3">
      <div>
        <div className="relative  flex items-center">
          <TextInput
            icon={MagnifyingGlassCircleIcon}
            onValueChange={(value) => handleChange(value)}
            placeholder="Search"
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
