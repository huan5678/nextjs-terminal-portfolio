const asciiLogo = `  __  ____     __   _____ _____ _______ ______ 
 |  \/  \ \   / /  / ____|_   _|__   __|  ____|
 | \  / |\ \_/ /  | (___   | |    | |  | |__   
 | |\/| | \   /    \___ \  | |    | |  |  __|  
 | |  | |  | |     ____) |_| |_   | |  | |____ 
 |_|  |_|  |_|    |_____/|_____|  |_|  |______|
                                               
                                               
`;

export default function AsciiHero() {
  return (
    <section className='py-6'>
      <pre className='text-[12px] leading-[12px] select-none'>{asciiLogo}</pre>
    </section>
  );
}
