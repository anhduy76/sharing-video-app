import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import {
  AppBar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from "@mui/material";
import { AuthContext } from "../context/AuthProvider";
import YouTubeEmbed from "./YoutubeEmbed";
import { getEmbedId, getVideoTitle } from "../utils/getEmbedId";
import { graphQLRequest } from "../utils/request";
import { SubscriptionClient } from 'subscriptions-transport-ws';
import {GRAPHQL_SUBSCRIPTION_ENDPOINT} from '../utils/constants';
import Noti from "./Noti";


export default function Home() {
  const { user, setUser } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [embedId, setEmbedId] = useState("");
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [data, setData] = useState([]);
  const [noti, setNoti] = useState([])
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.clear();
    setUser({});

    navigate("/login");
  };
  const handleShare = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const onVote = () => {
    console.log('vaoday')
  }
  // Subscription noti
  useEffect(() => {
    const client = new SubscriptionClient(`${GRAPHQL_SUBSCRIPTION_ENDPOINT}/graphql`, {
      reconnect: true, // Enable auto-reconnect
    });

    const subscription = client.request({
      query: `
      subscription notifyRealTime {
        notification_reads_aggregate{aggregate{count}}
      }
      `,
    }).subscribe({
      next: (data) => {
        console.log(data)
      },
      error: (error) => {
        console.error('Subscription error:', error);
      },
    });

    return () => {
      subscription.unsubscribe(); // Cleanup subscription on component unmount
      client.close(); // Close the WebSocket connection
    };
  }, [])
  useEffect(() => {
    setUserName(user.userName)
  }, [user])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await graphQLRequest({
          query: `query listSharedVideos($order: [shared_videos_order_by!]) {
              shared_videos(order_by: $order) {
                id
                sharedUser {
                  fullName
                }
                title
                description
                url
                 voted: votes_aggregate(where: {react: {_eq: "voted"}}) {aggregate{count}}
                 un_voted: votes_aggregate(where: {react: {_eq: "un_voted"}}) {aggregate{count}}
              }
          }`,
          variables: {
            order: {
              createdAt: "desc",
            },
          },
        }, {
          accessToken: user.accessToken
        });
        console.log(response);
        setData(response.shared_videos);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [open]);
  const sendRequestShared = async ({ title, description, url }) => {
    const res = await graphQLRequest({
      query: `mutation shareVideo($objectShare: shared_videos_insert_input!) {
        insert_shared_videos_one(object: $objectShare) {
          id
        }
    }`,
      variables: {
        objectShare: {
          title,
          description,
          url,
        },
      },
    }, {
      accessToken: user.accessToken
    });
    setOpen(false)
  };
  const onShare = () => {
    getVideoTitle(url)
      .then(({ title, description }) => {
        console.log("Video Title:", title);
        console.log("Video des:", description);
        sendRequestShared({ title, description, url });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const onChangeUrl = (e) => {
    setUrl(e.target.value);
  };
  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#767676" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 40px",
          }}
        >
          <Typography>Funny Movie</Typography>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Typography>Welcome {userName}</Typography>
            <Button variant="contained" size="small" onClick={handleShare}>
              Share a movie
            </Button>
            <Button variant="contained" size="small" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </AppBar>
      {/* <Noti /> */}
      {data.map((item, index) => (
        <div
          style={{ padding: "10px 20px", display: "flex", gap: "24px" ,
        borderBottom: '1px solid #767676'}}
          key={index}
        >
          <YouTubeEmbed embedId={getEmbedId(item.url)} />
          <div
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography style={{ color: "red", textAlign: 'start' }} variant="h6">
              {item.title}
            </Typography>
            <p>Shared by: {item.sharedUser?.fullName}</p>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <p>{item.voted?.aggregate?.count}</p>
              <Button style={{padding: '0',margin: '0'}} onClick={onVote(item.id)}>
              <ThumbUpAltIcon />
              </Button>
              <p>{item.un_voted?.aggregate?.count}</p>
              <ThumbDownAltIcon />
            </div>
          <p style={{fontSize: '1.2rem'}}>Description:</p>
          <p style={{fontSize: '0.8rem', color:'#767676', textOverflow: 'ellipsis', overflow: 'hidden'}}>{item.description}</p>
          </div>
        </div>
      ))}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Share a Youtube movie</DialogTitle>
        <DialogContent>
          <TextField
            label="Youtube URL"
            fullWidth
            placeholder="Fill in url"
            value={url}
            onChange={onChangeUrl}
          ></TextField>
          <Button
            style={{ width: "100%", marginTop: "24px" }}
            variant="contained"
            size="medium"
            onClick={onShare}
          >
            Share
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
