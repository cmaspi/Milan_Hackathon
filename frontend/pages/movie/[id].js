import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Image from "next/legacy/image";
import Banner from "../../components/Banner";
import Head from "next/head";
import Header from "../../components/Header";
import requests from "../../requests";
import { Box, CircularProgress, Typography, Avatar, TextField, Button, List, ListItem, ListItemText, Input, Rating, Stepper, Step, StepButton  } from "@mui/material";
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { useSession, signIn } from "next-auth/react";
import charakaLogo from "../../assets/charaka.png"


const customTheme = (outerTheme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-root': {
                color: 'white',
              },
          },
        },
      },
    },
  });

const steps = ['All Reviews', 'Positive Reviews', 'Neutral Reviews', 'Negative Reviews'];

export default function Movie() {

    const { data: session, status } = useSession();

    const router = useRouter();
    const { id } = router.query;

    const [activeStep, setActiveStep] = useState(0);

    const [movie, setMovie] = useState([]);
    const [progress, setProgress] = useState(0);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([
        {
          "movie_id": 1,
          "user_name": "Alice",
          "user_email": "alice@example.com",
          "review": "Great movie! I loved it.",
          "rating": 5,
          "sentiment": "positive"
        },
        {
          "movie_id": 2,
          "user_name": "Bob",
          "user_email": "bob@example.com",
          "review": "It was an average movie, nothing special. It was an average movie, nothing special.It was an average movie, nothing special.It was an average movie, nothing special.It was an average movie, nothing special.It was an average movie, nothing special.It was an average movie, nothing special.It was an average movie, nothing special.It was an average movie, nothing special.It was an average movie, nothing special.It was an average movie, nothing special.",
          "rating": 3,
          "sentiment": "neutral"
        },
        {
          "movie_id": 3,
          "user_name": "Charlie",
          "user_email": "charlie@example.com",
          "review": "Terrible film, waste of time.",
          "rating": 1,
          "sentiment": "negative"
        },
        {
          "movie_id": 4,
          "user_name": "David",
          "user_email": "david@example.com",
          "review": "I didn't like it at all. I didn't like it at all.I didn't like it at all.I didn't like it at all.I didn't like it at all.I didn't like it at all.I didn't like it at all.I didn't like it at all.I didn't like it at all.I didn't like it at all.I didn't like it at all.I didn't like it at all.I didn't like it at all.I didn't like it at all.I didn't like it at all.",
          "rating": 2,
          "sentiment": "negative"
        },
        {
          "movie_id": 5,
          "user_name": "Eve",
          "user_email": "eve@example.com",
          "review": "A decent movie, but not my favorite.",
          "rating": 3,
          "sentiment": "neutral"
        }
      ]
      );

    const [filteredReviews, setFilteredReviews] = useState(reviews);
    
    const [similarity, setSimilarity] = useState("90%");
    const theme = useTheme();

    const handleReviewChange = (event) => {
      if (!session) {
        signIn();
        return;
      }
        setReview(event.target.value);
    };

    const handleAddReview = () => {
      if (!session) {
        signIn();
        return;
      }
      var reviewObj = {
          "movie_id": 1,
          "user_name": session.user.name,
          "user_email": session.user.email,
          "review": review,
          "rating": rating,
          "sentiment": "positive"
      }
      console.log(reviewObj);
      if (review.trim() !== '') {
        setReviews([reviewObj , ...reviews]);
      }
    };

    const handleStep = (step) => () => {
      setActiveStep(step);
    }

    useEffect(() => {
      if (activeStep === 0) {
        setFilteredReviews(reviews);
      } else if (activeStep === 1) {
        setFilteredReviews(reviews.filter(r => r.sentiment === "positive"));
      } else if (activeStep === 2) {
        setFilteredReviews(reviews.filter(r => r.sentiment === "neutral"));
      } else if (activeStep === 3) {
        setFilteredReviews(reviews.filter(r => r.sentiment === "negative"));
      }
    }, [activeStep]);

    const handleRatingChange = (event) => {
        setRating(parseFloat(event.target.value));
    };

    async function getMovie(id) {
        const [
          trendingRes,
        ] = await Promise.all([
          fetch(`https://api.themoviedb.org/3${requests.fetchTrending}`),
        ]);
        console.log(trendingRes);
        const [trending] = await Promise.all([
          trendingRes.json(),
        ]);
        console.log(trending);
        setMovie(trending.results[id]);
    }

    useEffect(() => {
        if (id && router.isReady) {
            getMovie(0)
        }
    }, [id, router.isReady]);


    // not working
    useEffect(() => {
        const timer = setInterval(() => {
          setProgress((prevProgress) => {
            if (prevProgress >= movie.vote_average * 10) {
              clearInterval(timer);
              return movie.vote_average * 10;
            } else {
              return prevProgress + 1;
            }
          });
        }, 30);
    
        return () => {
          clearInterval(timer);
        };
      }, [movie]);

    return (
        (movie?
            <>
                <Head>
                <title>Charaka Movie Summarizer</title>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter"
                    rel="stylesheet"
                />
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href={charakaLogo} />
                </Head>

                <Header />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '1rem',
                        width: '100%',
                        height: '100vh',
                        alignContent: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5rem',
                            width: '30%',
                            margin: 'auto',
                            marginTop: '6rem',
                            alignContent: 'center',
                            justifyContent: 'center',
                            padding: '2rem',
                        }}
                    >
                        <Image
                            layout="responsive"
                            width={400}
                            height={300}
                            src={`https://image.tmdb.org/t/p/original${
                                movie.backdrop_path || movie.poster_path
                            }`}
                            alt={movie.title}
                            className="object-cover transition-all duration-500 group-hover:opacity-50 rounded-lg"
                        />
                        <Box
                            sx={{
                                margin: 'auto',
                            }}
                        >
                        <h2 className="text-xl font-semibold">{movie.original_title}</h2>
                        <p className="text-yellow-500">{movie.vote_average} / 10</p>
                        {/* <Rating name="half-rating-read" defaultValue={4} precision={0.5} readOnly /> */}
                        {/* <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress variant="determinate" value={progress} />
                        <Box
                            sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            }}
                        >
                            <p className="text-yellow-500">{movie.vote_average}{`${Math.round(progress/10)}`}</p>
                        </Box>
                        </Box> */}
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: 'block',
                            width: '70%',
                            margin: '0 auto',
                            marginTop: '8rem',
                            paddingLeft: '5rem',
                            paddingRight: '5rem',
                        }}
                    >   
                        <h1 className="font-bold text-xl sm:text-3xl">Overview</h1>
                        <p>{movie.overview}</p>
                        <h1 className="font-bold text-xl sm:text-3xl mt-4">Computed Summary</h1>
                        <p>{movie.overview}</p>
                        {/* <Box display="flex"
                            flexDirection="row"
                            gap={2}
                            sx={{alignContent:"center", justifyContent:"center"}}
                        >
                            <Box className="mb-4 mt-4 w-16 h-16 border border-white-200 rounded-full flex items-center justify-center">
                                <span className="text-white text-2xl">{similarity}</span>
                            </Box>
                            <Box className="text-center mb-4 mt-4 w-16 h-16  flex items-center ">
                                <span className="text-white text-2xl">match</span>
                            </Box>
                        </Box> */}
                        <ThemeProvider theme={customTheme(theme)}>
                            <TextField
                                fullWidth
                                label="Enter your review"
                                variant="outlined"
                                value={review}
                                multiline
                                onChange={handleReviewChange}
                                className="mb-4 mt-4"
                                error
                            />
                        </ThemeProvider>
                        <Box
                            sx={{
                                display:"flex",
                                flexDirection:"column",
                            }}
                        >

                            <Typography variant="h6" fontWeight={"bold"}>
                                How do you rate this movie?
                            </Typography>
                            <Rating name="half-rating" defaultValue={2.5} precision={0.5} value={rating} onChange={handleRatingChange}
                            sx={{".MuiRating-iconEmpty":{color:"red"}, width:"150px"}}
                            />
                            <Button
                                variant="outlined" 
                                color="error"
                                onClick={handleAddReview}
                                className="mb-4 mt-4"
                                sx={{width:"fit-content"}}
                                >
                                Add Review
                            </Button>
                        </Box>
                        <Stepper nonLinear activeStep={activeStep} sx={{marginTop:"3rem"}}>
                          {steps.map((label, index) => (
                            <Step key={label}
                              sx={{
                                '& .MuiStepLabel-root .Mui-active ': {
                                  color: 'red',
                                },
                                '& .MuiStepLabel-label': {
                                  color: 'white',
                                },
                              }}
                            
                            >
                              <StepButton onClick={handleStep(index)} >
                                {label}
                              </StepButton>
                            </Step>
                          ))}
                        </Stepper>
                        <h1 className="font-bold text-xl sm:text-3xl mt-10">Reviews</h1>
                                {/* <ListItem key={index}>
                                    <ListItemText primary={r.user_name} secondary={r.user_email}/>

                                </ListItem> */}
                            <List>
                                {filteredReviews?.map((r, index) => (
                                    <Box key={index}>
                                    <Box
                                        sx={{
                                            display:"flex",
                                            flexDirection:"row",
                                            justifyContent:"space-between"
                                        }}
                                        key={index}
                                    >
                                    <Typography variant="h6" fontWeight={"bold"}>
                                        {r.user_name}  
                                        <span style={{color:"grey"}}>
                                        {`  (${r.user_email})`}
                                        </span>
                                    </Typography>
                                    <Rating name="half-rating-read" value={r.rating} precision={0.5} readOnly />
                                    </Box>
                                    <p className="sm:text-base text-xs pr-8 mb-10">
                                        {r.review}
                                    </p>
                                    </Box>
                                ))}
                            </List>
                    </Box>
                </Box>
            </>
            :
        <>
        </>
            )
    )
}