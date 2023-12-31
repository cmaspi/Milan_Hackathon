import Head from "next/head";
import Banner from "../components/Banner";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import { Box, Grid, Pagination, PaginationItem } from "@mui/material";
import Image from "next/legacy/image";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useRouter } from "next/router";
import Link from "next/link";
const theme = createTheme({
  components: {
    MuiPaginationItem: {
      styleOverrides: {
        ellipsis: {
          color: 'white',
        },
        root: {
          color: 'white',
        }
      },
    },
  },
});


export default function Home() {

  const [show, setShow] = useState(false);
  const router = useRouter();
  const [page_movies, setPageMovies] = useState([]);

  async function getMovies() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/movies?page=${page}`);
    const data = await res.json();
    setPageMovies(data);
  }
  
  const [page, setPage] = useState(1);

  useEffect(() => {
    getMovies().then(() => {
      setShow(true);
    });
  }, [page]);

  

  // useEffect(() => {
  //   if (trending.results){
  //     setPageMovies(trending.results.slice((page-1)*1000, page*1000));
  //   }
  // },[trending, page]);


  // useEffect(() => {
    
  // }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    (show? 
      <>
        <Head>
          <title>Charaka Movie Summarizer</title>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter"
            rel="stylesheet"
          />
          <meta name="description" content="Generated by create next app" />
        </Head>

        <Header />
        {/* <Banner movies={trending.results} /> */}
        <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop:"15rem"}}>
        <Pagination count={80} color="secondary" showFirstButton showLastButton page={page} onChange={handlePageChange}/>
        </Box>
        </ThemeProvider>
          <h1 className="font-bold text-xl sm:text-3xl p-3">Movies</h1>
            <Grid container spacing={2} className="p-3 sm:p-5" >
              {page_movies?.map((a) => (
                <Grid item xs={12} sm={8} md={6} lg={3} key={a.id}>
                  <Link href={`/movie/${a.id}`}>
                    <div
                      className="group hover:sm:mx-5 hover:scale-105 relative transition-all duration-500 hover:cursor-pointer"
                    >
                      <Image
                        layout="fixed"
                        className="object-cover transition-all duration-500 group-hover:opacity-50 rounded-lg"
                        width={400}
                        height={300}
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/posters/${a.id}.jpg`}
                        alt={a.title}
                      />
                      <div className="group-hover:flex group-hover:animation-fadeUp flex-col duration-1000  hidden absolute bottom-3  left-3">
                        {/* <div className="flex space-x-3 items-center">
                          <motion.div
                            onClick={() => {
                              setId(a.id);
                              setShow(true);
                            }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-white w-12 h-12 flex rounded-full items-center justify-center"
                          >
                            <BsFillPlayFill className="text-black text-3xl" />
                          </motion.div>
                          <div>
                            <AiOutlinePlusCircle className="text-4xl" />
                          </div>
                        </div> */}

                        <div>
                          <p
                            className={`text-white sm:text-3xl text-lg font-semibold`}
                          >
                            {a.movie_title}
                          </p>
                          <p className="line-clamp-3 sm:text-base text-xs pr-8">
                            {a.movie_info}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Grid>
              ))}
            </Grid>
      </>
      :<></>)
  );
}

// export async function getServerSideProps(context) {
//   const [
//     trendingRes,
//     actionRes,
//     netflixRes,
//     topRatedRes,
//     horrorRes,
//     comedyRes,
//     romanceRes,
//     documentaryRes,
//   ] = await Promise.all([
//     fetch(`https://api.themoviedb.org/3${requests.fetchTrending}`),
//     fetch(`https://api.themoviedb.org/3${requests.fetchActionMovies}`),
//     fetch(`https://api.themoviedb.org/3${requests.fetchNetflixOriginals}`),
//     fetch(`https://api.themoviedb.org/3${requests.fetchTopRated}`),
//     fetch(`https://api.themoviedb.org/3${requests.fetchHorrorMovies}`),
//     fetch(`https://api.themoviedb.org/3${requests.fetchComedyMovies}`),
//     fetch(`https://api.themoviedb.org/3${requests.fetchRomanceMovies}`),
//     fetch(`https://api.themoviedb.org/3${requests.fetchDocumentaries}`),
//   ]);
//   const [
//     trending,
//     action,
//     netflix,
//     topRated,
//     horror,
//     comedy,
//     romance,
//     documentary,
//   ] = await Promise.all([
//     trendingRes.json(),
//     actionRes.json(),
//     netflixRes.json(),
//     topRatedRes.json(),
//     horrorRes.json(),
//     comedyRes.json(),
//     romanceRes.json(),
//     documentaryRes.json(),
//   ]);
//   console.log(netflix.results);
//   return {
//     props: {
//       trending,
//       action,
//       netflix,
//       topRated,
//       horror,
//       comedy,
//       romance,
//       documentary,
//     },
//   };
// }