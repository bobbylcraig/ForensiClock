import React from 'react';
import { StyleSheet, Text, View, ListView, TouchableHighlight } from 'react-native';
import TimeFormatter from 'minutes-seconds-milliseconds';

let ds = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
})

export default class Stopwatch extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            laps: [],
            dataSource: ds.cloneWithRows([]),
            isRunning: false,
            mainTimer: null,
            lapTimer: null,
            mainTimerStart: null,
            lapTimerStart: null,
            lapCount: 1,
        }
    }

    handleStartStop() {
        let { isRunning, firstTime, mainTimer, lapTimer } = this.state;

        if (isRunning) {
            clearInterval(this.interval);
            this.setState({
                isRunning: false,
            });
            return;
        }

        this.setState({
            mainTimerStart: new Date(),
            lapTimerStart: new Date(),
            isRunning: true,
        });

        this.interval = setInterval(() => {
            this.setState({
                mainTimer: new Date() - this.state.mainTimerStart + mainTimer,
                lapTimer: new Date() - this.state.lapTimerStart + lapTimer,
            });
        }, 30);
    }

    handleLapReset() {
        let { isRunning, mainTimerStart } = this.state;

        if (mainTimerStart && !isRunning) {
            this.setState({
                dataSource: ds.cloneWithRows([]),
                laps: [],
                mainTimerStart: null,
                lapTimerStart: null,
                mainTimer: 0,
                lapTimer: 0,
                lapCount: 1,
            });
        }

        if (isRunning) {
            var newLaps = this.state.laps;
            newLaps.push({ name: "Lap " + this.state.lapCount, value: TimeFormatter(this.state.lapTimer) });
            this.setState({
                lapCount: this.state.lapCount + 1,
                laps: newLaps,
                dataSource: ds.cloneWithRows(newLaps),
                lapTimer: 0,
                lapTimerStart: new Date(),
            });
        }
    }

    _renderTitle() {
        return(
            <View style={styles.header}>
                <Text style={styles.title}>ForensiClock</Text>
            </View>
        );
    }

    _renderLaps() {
        return(
            <View style={styles.lapsWrapper}>
                <ListView
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderRow={ (rowData) => (
                        <View style={styles.lapRow}>
                            <Text style={styles.lapNumber}>{rowData.name}</Text>
                            <Text style={styles.lapTime}>{rowData.value}</Text>
                        </View>
                    )}
            />
            </View>
        );
    }

    _renderTimers() {
        return(
            <View style={styles.timerWrapper}>
                <View style={styles.timerWrapperInner}>
                    <Text style={styles.lapTimer}>{ TimeFormatter(this.state.lapTimer) }</Text>
                    <Text style={styles.mainTimer}>{ TimeFormatter(this.state.mainTimer) }</Text>
                </View>
            </View>
        );
    }

    _renderButtons() {
        return(
            <View style={styles.buttonWrapper}>
                <TouchableHighlight underlayColor="#777" onPress={this.handleLapReset.bind(this)} style={styles.button}>
                    <Text>{ !this.state.isRunning ? 'Reset' : 'Lap' }</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor="#777"
                    onPress={this.handleStartStop.bind(this)}
                    style={styles.button}
                >
                    <Text style={styles.startButton, this.state.isRunning && styles.stopButton}>{this.state.isRunning ? 'Stop' : 'Start'}</Text>
                </TouchableHighlight>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.top}>
                    {this._renderTitle()}
                    {this._renderTimers()}
                </View>
                <View style={styles.bottom}>
                    {this._renderButtons()}
                    {this._renderLaps()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
      borderBottomWidth: 0.5,
      paddingTop: 20,
      paddingBottom: 10,
      backgroundColor: "#F9F9F9",
  },
  title: {
      alignSelf: "center",
      fontWeight: "600",
  },
  buttonWrapper: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingTop: 15,
      paddingBottom: 30,
  },
  button: {
      height: 80,
      width: 80,
      borderRadius: 40,
      backgroundColor: "#FFF",
      justifyContent: "center",
      alignItems: "center",
  },
  startButton: {
      color: "#00CC00",
  },
  stopButton: {
      color: "red",
  },
  timerWrapper: {
      justifyContent: "center",
      backgroundColor: "#FFFFFF",
      flex: 1,
  },
  timerWrapperInner: {
      alignSelf: "center",
  },
  mainTimer: {
      fontSize: 60,
      fontWeight: "100",
      alignSelf: "flex-end",
  },
  lapTimer: {
      fontSize: 18,
      alignSelf: "flex-end",
  },
  top: {
      flex: 1,
  },
  bottom: {
      flex: 2,
      backgroundColor: "#F0EFF5",
  },
  lapRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      height: 40,
      paddingTop: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: "#DDD",
  },
  lapNumber: {
      fontSize: 16,
      color: "#777",
  },
  lapTime: {
      color: "#000",
      fontSize: 20,
      fontWeight: "300",
  }
});
