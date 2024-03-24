import { cn } from "@/utils/cn";
import React from "react";
import { IoSearch } from "react-icons/io5";

type Props = {
    className?: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
    onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
};

function SearchBox(props: Props) {
    return (
        <>
            <form
                className={cn(
                    "flex relative items-center justify-center h-10",
                    props.className
                )}
                onSubmit={props.onSubmit}
            >
                <input
                    type="text"
                    onChange={props.onChange}
                    placeholder="Search Loaction"
                    className="px-4 py-2 w-[230px] rounded-1-md focus:outline-none focus:border focus:border-gray-300 h-full"
                />
                <button className="px-4 py-[9px] rounded-r-md bg-gray-100 focus:outline-none hover:bg-gray-300 whitespace-nowrap h-full">
                    <IoSearch />
                </button>
            </form>
        </>
    );
}

export default SearchBox;
