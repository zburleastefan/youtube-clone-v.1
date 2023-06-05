import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import React from "react";

type Props = {}

function SearchBar({}: Props) {
  const router = useRouter();
  const [input, setinput] = React.useState<string>('');

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    router.push(`/search/${input}`);
    setinput('');
    // Remove focus from specific element
    const inputElem = document.getElementById('searchInput');
    inputElem!.blur();
  }
  
  return ( 
    <form 
      onSubmit={handleSubmit}
      className='flex text-center align-middle rounded-3xl'
    >
      <input 
        id='searchInput'
        type='text'
        name='text'
        className='md:w-[500px] rounded-3xl bg-transparent border-[1px] p-1 px-2 mr-[5px] md:mr-3'
        placeholder='Search...'
        value={input}
        onChange={(e) => setinput(e.target.value)}
      />
      <button            
        className="bg-[#11A37F] hover:opacity-50 text-white 
        w-10 h-10 md:w-12 md:h-12 rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed font-bold"
        disabled={!input  || input == " "} 
        type="submit"
      >
        <MagnifyingGlassIcon className={`p-2 rotate-90 items-center text-center align-middle justify-center object-scale-down`} />
      </button>   
    </form>
  )
}

export default SearchBar;