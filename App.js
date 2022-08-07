import React, { Component } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  PermissionsAndroid,
} from "react-native";
import Tuner from "./src/tuner";
import Note from "./src/note";
import Meter from "./src/meter";

export default class App extends Component {
  state = {
    note: {
      name: "A",
      octave: 4,
      frequency: 440,
    },
  };

  _update(note) {
    this.setState({ note });
  }

  async componentDidMount() {
    if (Platform.OS === "android") {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }

    const tuner = new Tuner();
    tuner.start();
    tuner.onNoteDetected = (note) => {
      if (this._lastNoteName === note.name) {
        this._update(note);
      } else {
        this._lastNoteName = note.name;
      }
    };
  }

  render() {
    return (
      <View style={style.body}>
        <Text style={style.title}>መቃኛ</Text>
        <StatusBar backgroundColor="#000" translucent />
        <Meter cents={this.state.note.cents} />
        <Note {...this.state.note} />
        <Text style={style.frequency}>
          {this.state.note.frequency.toFixed(1)} Hz
        </Text>
      </View>
    );
  }
}

const style = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  frequency: {
    fontSize: 28,
    color: "#37474f",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    paddingBottom: 40,
  }
});