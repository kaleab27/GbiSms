import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import EachPost from "./EachPost";
import { baseUrl, color } from "../../../config";
import axios from "axios";
import SeeMoreButton from "../../../AppComponents/SeeMoreButton";
import DarkModeContext from "../../Context/DarkModeContext";

const ShowPostScreen = ({ url }) => {
  const [messages, setMessages] = useState([]);
  const [fechUrl, setFechUrl] = useState();
  const [refresh, setRefresh] = useState(false);
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    if (url) {
      setFechUrl(url);
    } else {
      setFechUrl(`${baseUrl}/anouncementPost/`);
    }
  }, []);

  const fechReloadHanlder = () => {
    axios
      .get(`${baseUrl}/anouncementPost/`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!fechUrl) return;
    axios
      .get(fechUrl)
      .then((res) => {
        console.log(refresh, "refreshing refresing rrrr.....****");
        if (messages?.results?.length > 0 && !refresh) {
          let mesData = [...messages?.results, ...res.data.results];
          let setData = res.data;
          setData.results = mesData;
          setMessages(setData);
          return;
        }
        setMessages(res.data);
      })
      .catch((err) => console.log(err));
  }, [fechUrl]);

  const seeMoreHandler = () => {
    if (!messages?.next) return;
    setFechUrl(messages.next);
  };

  const handleRefresh = () => {
    setRefresh(true);
    // setFechUrl(`${baseUrl}/anouncementPost/`)
    console.log("kidame kidma");
    fechReloadHanlder();
    setRefresh(false);
  };

  return (
    <>
      <FlatList
        data={messages?.results}
        renderItem={({ item }) => (
          <EachPost item={item} url={url ? url : null} />
        )}
        refreshing={refresh}
        onRefresh={handleRefresh}
        keyExtractor={(item) => item?.id?.toString()}
        key={(item) => item?.id}
        style={{ backgroundColor: darkMode ? color.darkBackground : "white" }}
        ListFooterComponent={() => (
          <>
            <SeeMoreButton onPress={seeMoreHandler} />
          </>
        )}
      />
    </>
  );
};

export default ShowPostScreen;

const styles = StyleSheet.create({
  seemoreBtn: {
    width: 20,
    backgroundColor: "red",
  },
});
