import Image from "next/legacy/image";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from "next/router";
import charakaLogo from "../assets/charaka.png"
import { Autocomplete, Box, TextField } from "@mui/material";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "yellow"
  },
  clearIndicator: {
    color: "red",
  },
  popupIndicator: {
    color: "red",
  }
}));

function Header() {
  const [show, setShow] = useState(false);

  const [loginShow,setLoginShow] = useState(false);
  const {data : session} = useSession();

  const [movieNames, setMovieNames] = useState([
    { label: 'The Shawshank Redemption', id: 1994 },
  { label: 'The Godfather', id: 1972 },
  { label: 'The Godfather: Part II', id: 1974 },
  { label: 'The Dark Knight', id: 2008 },
  { label: '12 Angry Men', id: 1957 },
  { label: "Schindler's List", id: 1993 },
  { label: 'Pulp Fiction', id: 1994 },
  {
    label: 'The Lord of the Rings: The Return of the King',
    id: 2003,
  },
  { label: 'The Good, the Bad and the Ugly', id: 1966 },
  { label: 'Fight Club', id: 1999 },
  {
    label: 'The Lord of the Rings: The Fellowship of the Ring',
    id: 2001,
  },
  {
    label: 'Star Wars: Episode V - The Empire Strikes Back',
    id: 1980,
  },
  { label: 'Forrest Gump', id: 1994 },
  { label: 'Inception', id: 2010 },
  {
    label: 'The Lord of the Rings: The Two Towers',
    id: 2002,
  },
  { label: "One Flew Over the Cuckoo's Nest", id: 1975 },
  { label: 'Goodfellas', id: 1990 },
  { label: 'The Matrix', id: 1999 },
  { label: 'Seven Samurai', id: 1954 },
  {
    label: 'Star Wars: Episode IV - A New Hope',
    id: 1977,
  },
  { label: 'City of God', id: 2002 },
  { label: 'Se7en', id: 1995 },
  { label: 'The Silence of the Lambs', id: 1991 },
  { label: "It's a Wonderful Life", id: 1946 },
  { label: 'Life Is Beautiful', id: 1997 },
  { label: 'The Usual Suspects', id: 1995 },
  { label: 'Léon: The Professional', id: 1994 },
  { label: 'Spirited Away', id: 2001 },
  { label: 'Saving Private Ryan', id: 1998 },
  { label: 'Once Upon a Time in the West', id: 1968 },
  { label: 'American History X', id: 1998 },
  { label: 'Interstellar', id: 2014 },
  { label: 'Casablanca', id: 1942 },
  { label: 'City Lights', id: 1931 },
  { label: 'Psycho', id: 1960 },
  { label: 'The Green Mile', id: 1999 },
  { label: 'The Intouchables', id: 2011 },
  { label: 'Modern Times', id: 1936 },
  { label: 'Raiders of the Lost Ark', id: 1981 },
  { label: 'Rear Window', id: 1954 },
  { label: 'The Pianist', id: 2002 },
  { label: 'The Departed', id: 2006 },
  { label: 'Terminator 2: Judgment Day', id: 1991 },
  { label: 'Back to the Future', id: 1985 },
  { label: 'Whiplash', id: 2014 },
  { label: 'Gladiator', id: 2000 },
  { label: 'Memento', id: 2000 },
  { label: 'The Prestige', id: 2006 },
  { label: 'The Lion King', id: 1994 },
  { label: 'Apocalypse Now', id: 1979 },
  { label: 'Alien', id: 1979 },
  { label: 'Sunset Boulevard', id: 1950 },
  {
    label: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    id: 1964,
  },
  { label: 'The Great Dictator', id: 1940 },
  { label: 'Cinema Paradiso', id: 1988 },
  { label: 'The Lives of Others', id: 2006 },
  { label: 'Grave of the Fireflies', id: 1988 },
  { label: 'Paths of Glory', id: 1957 },
  { label: 'Django Unchained', id: 2012 },
  { label: 'The Shining', id: 1980 },
  { label: 'WALL·E', id: 2008 },
  { label: 'American Beauty', id: 1999 },
  { label: 'The Dark Knight Rises', id: 2012 },
  { label: 'Princess Mononoke', id: 1997 },
  { label: 'Aliens', id: 1986 },
  { label: 'Oldboy', id: 2003 },
  { label: 'Once Upon a Time in America', id: 1984 },
  { label: 'Witness for the Prosecution', id: 1957 },
  { label: 'Das Boot', id: 1981 },
  { label: 'Citizen Kane', id: 1941 },
  { label: 'North by Northwest', id: 1959 },
  { label: 'Vertigo', id: 1958 },
  {
    label: 'Star Wars: Episode VI - Return of the Jedi',
    id: 1983,
  },
  { label: 'Reservoir Dogs', id: 1992 },
  { label: 'Braveheart', id: 1995 },
  { label: 'M', id: 1931 },
  { label: 'Requiem for a Dream', id: 2000 },
  { label: 'Amélie', id: 2001 },
  { label: 'A Clockwork Orange', id: 1971 },
  { label: 'Like Stars on Earth', id: 2007 },
  { label: 'Taxi Driver', id: 1976 },
  { label: 'Lawrence of Arabia', id: 1962 },
  { label: 'Double Indemnity', id: 1944 },
  {
    label: 'Eternal Sunshine of the Spotless Mind',
    id: 2004,
  },
  { label: 'Amadeus', id: 1984 },
  { label: 'To Kill a Mockingbird', id: 1962 },
  { label: 'Toy Story 3', id: 2010 },
  { label: 'Logan', id: 2017 },
  { label: 'Full Metal Jacket', id: 1987 },
  { label: 'Dangal', id: 2016 },
  { label: 'The Sting', id: 1973 },
  { label: '2001: A Space Odyssey', id: 1968 },
  { label: "Singin' in the Rain", id: 1952 },
  { label: 'Toy Story', id: 1995 },
  { label: 'Bicycle Thieves', id: 1948 },
  { label: 'The Kid', id: 1921 },
  { label: 'Inglourious Basterds', id: 2009 },
  { label: 'Snatch', id: 2000 },
  { label: '3 Idiots', id: 2009 },
  { label: 'Monty Python and the Holy Grail', id: 1975 },
  ]);

  const classes = useStyles();

  const router = useRouter();

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setShow(true);
      } else {
        setShow(false);
      }
    });
    // return () => {
    //   window.removeEventListener("scroll");
    // };
  }, []);
  return (
    <div
      style={{ backgroundColor: `${show ? "black" : "rgba(0,0,0,0.8)"}` }}
      className="transition-all duration-1000 flex fixed z-50 top-0 w-full  items-center px-3 h-100"
    >
      <div className="flex-1">
        <Image
          width={100}
          height={100}
          src={charakaLogo}
          onClick={() => {
            router.push("/");
          }}
        />
      </div>
        <Autocomplete
          autoHighlight
          id="combo-box-demo"
          options={movieNames}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300, marginRight: "45rem"}}
          classes={{
            clearIndicator: classes.clearIndicator,
            popupIndicator: classes.popupIndicator,
          }}
          onChange={(event, value) => {
            if(value){
              router.push(`/movie/${value.id}`)
            }
          }}
          renderInput={(params) => 
          <TextField {...params}
            sx={{borderRadius:"5px",  ".MuiInputBase-root" : {color:"white"}}}
            error
            label="Movie" />}
        />
      <div className="w-[30px] h-[30px] rounded-full overflow-hidden" onClick={()=>setLoginShow(!loginShow)} >
        {session ? 
          <Image width={100} height={100} src={session.user.image}/>
        :
          <Image width={100} height={100} src="https://www.w3schools.com/howto/img_avatar.png" />
        }
      </div>
      <div className={`absolute top-[50px] right-[20px] ${loginShow ? "flex" : "hidden"} p-[15px] bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg`}>
        {!session ? 
        <div className="flex w-full flex-col">
          <p>You are not logged in!!</p>
          <button className="w-full bg-red-600 p-[5px] rounded-md mt-[5px]" onClick={()=>signIn()}>Log In</button>
        </div>
        : 
        <div className="flex w-full flex-col">
          <div className="flex flex-col"><span className="text-base font-bold">{session.user.name}</span><span className="text-sm font-thin">{session.user.email}</span></div>
          <button className="w-full bg-red-600 p-[5px] rounded-md mt-[5px]" onClick={()=>signOut()}>Log Out</button>
        </div>
        }
      </div>
    </div>
  );
}

export default Header;
