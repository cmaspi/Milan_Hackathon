import Image from "next/legacy/image";
import { use, useEffect, useState } from "react";
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from "next/router";
import charakaLogo from "../assets/charaka.png"
import { Autocomplete, Box, TextField, Typography } from "@mui/material";
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


  const [movieNames, setMovieNames] = useState([]);

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
    const res = fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/names`).then((res) => res.json());
    res.then((data) => {
      setMovieNames(data);
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
        <Box
          sx={{
            display: "flex",
            "& > :not(style)": { m: 1 },
          }}>
          <Image
            width={100}
            height={100}
            src={charakaLogo}
            onClick={() => {
              router.push("/");
            }}
          />
            <Typography
              variant="h5"
              component="div"
              sx={{color: "white", marginLeft: "10rem", display:"flex", verticalAlign:"center", alignItems:"center" }}
            >
              CHARAKA
            </Typography>
          </Box>
      </div>
        <Autocomplete
          autoHighlight
          id="combo-box-demo"
          options={movieNames}
          getOptionLabel={(option) => option?.id.split("_").join(" ")}
          key={(option) => option?.id+option?.title}
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
