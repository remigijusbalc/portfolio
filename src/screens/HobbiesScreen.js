/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
  Alert
} from "react-native";
import { connect } from "react-redux";
import { GradientView, Card, HobbyIcon, VideoModal } from "../components";
import Icon from "react-native-vector-icons/Feather";
import { STYLES, moderateScale } from "../helpers";

const TitleComponent = ({ title, icon, style }) => {
  return (
    <View style={style}>
      <HobbyIcon
        style={STYLES.ICON}
        name={icon}
        // size={moderateScale(40)}
      />
      <Text style={[STYLES.H2, { margin: 8, letterSpacing: 1 }]}>{title}</Text>
    </View>
  );
};

const DescriptionComponent = ({ children, description, style, ...props }) => {
  return (
    <View {...props} style={style}>
      <Text style={[STYLES.BODY, { margin: 8 }]}>{description}</Text>
      {children}
    </View>
  );
};

class HobbiesScreen extends Component<Props> {
  constructor(props) {
    super(props);

    this.primaryColors = ["#2897B0", "#D7971A", "#90A02D"];
    this.secondaryColors = ["#99CED9", "#e2b75f", "#CED5A2"];
    this.hobbiesIcons = ["drum", "running", "book", "futbol"];

    this.state = {
      modalVisible: false,
      hobbiesArray: []
    };
  }

  componentDidMount() {
    const {
      translations: { drumming, jogging, books, football }
    } = this.props;
    this.updateHobbiesArray([drumming, jogging, books, football]);
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.translations !== nextProps.translations) {
      const {
        translations: { drumming, jogging, books, football }
      } = nextProps;
      this.updateHobbiesArray([drumming, jogging, books, football]);
    }
    return true;
  }

  updateHobbiesArray = array => {
    const hobbies = array.reduce((acc, hobby, index) => {
      hobby.expanded = false;
      hobby.primaryColor = this.primaryColors[
        index % this.primaryColors.length
      ];
      hobby.secondaryColor = this.secondaryColors[
        index % this.secondaryColors.length
      ];
      hobby.icon = this.hobbiesIcons[index];
      acc.push(hobby);
      return acc;
    }, []);
    this.setState({ hobbiesArray: hobbies });
  };

  toggleModal = () => {
    this.setState(prevState => {
      return { modalVisible: !prevState.modalVisible };
    });
  };
  toggleBox = id => {
    const { hobbiesArray } = this.state;
    const updatedHobbiesArray = hobbiesArray.map(value => {
      if (value === id) value.expanded = !value.expanded;
      return value;
    });
    this.setState({ hobbiesArray: updatedHobbiesArray });
  };

  render() {
    const { hobbiesArray, modalVisible } = this.state;
    const {
      translations: { Hobbies, closeModal }
    } = this.props;

    return (
      <GradientView style={{ flex: 1 }}>
        <Text style={[STYLES.H1, { paddingTop: 8 }]}>
          {Hobbies.toUpperCase()}
        </Text>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {hobbiesArray.map((hobby, index) => {
            return (
              <Card
                key={hobby.primaryColor + index}
                style={{
                  backgroundColor: hobby.primaryColor,
                  width: "80%"
                }}
              >
                <TouchableOpacity onPress={this.toggleBox.bind(this, hobby)}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <TitleComponent
                      style={{
                        flexDirection: "row",
                        marginLeft: 8,
                        alignItems: "center"
                      }}
                      icon={hobby.icon}
                      title={hobby.title}
                    />
                    <Icon
                      style={{
                        fontSize: moderateScale(20),
                        paddingRight: 4
                      }}
                      color="#fff"
                      name={
                        hobby.expanded ? "arrow-up-circle" : "arrow-down-circle"
                      }
                      // size={40}
                    />
                  </View>
                  {hobby.expanded ? (
                    <DescriptionComponent
                      style={{
                        flexDirection: "column",
                        backgroundColor: hobby.secondaryColor,
                        width: "100%"
                      }}
                      description={hobby.description}
                    >
                      {hobby.hasOwnProperty("openVideos") ? (
                        <TouchableOpacity
                          style={{ margin: 8 }}
                          onPress={this.toggleModal}
                        >
                          <Text
                            style={{
                              alignSelf: "center",
                              backgroundColor: hobby.primaryColor,
                              textAlign: "center",
                              fontSize: 18,
                              fontWeight: "800",
                              color: "#fff",
                              padding: 8
                            }}
                          >
                            {hobby.openVideos}
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                    </DescriptionComponent>
                  ) : null}
                </TouchableOpacity>
              </Card>
            );
          })}
        </ScrollView>
        <VideoModal
          visible={modalVisible}
          closeModal={this.toggleModal}
          videoUris={[
            "https://www.youtube.com/embed/CPJIwKVBsBI",
            "https://www.youtube.com/embed/ejNl4pcn1M4",
            "https://www.youtube.com/embed/kTJYf1y5PzM"
          ]}
        />
      </GradientView>
    );
  }
}

const mapStateToProps = state => {
  return {
    translations: state.language.translations
  };
};

export default connect(
  mapStateToProps,
  null
)(HobbiesScreen);
