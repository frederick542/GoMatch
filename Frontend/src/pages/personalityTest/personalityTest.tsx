import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import CustomTheme from '../../models/CustomTheme';
import useCustomTheme from '../../hooks/useCustomTheme';
import LottieView from 'lottie-react-native';
import UserService from '../../services/userService';

interface Option {
  text: string;
  score: keyof PersonalityScores;
}

interface Question {
  question: string;
  options: Option[];
}

interface PersonalityScores {
  romantic: number;
  adventurer: number;
  intellectual: number;
  caregiver: number;
  funSeeker: number;
  realist: number;
}

const personalityIcons = {
  romantic: require('../../assets/heart.png'),
  adventurer: require('../../assets/compass.png'),
  intellectual: require('../../assets/book.png'),
  caregiver: require('../../assets/careGiver.png'),
  funSeeker: require('../../assets/party-popper.png'),
  realist: require('../../assets/balance-sheet.png'),
};

const userService = UserService();

const personalityTypes: Record<
  keyof PersonalityScores,
  {name: string; description: string; icon: string}
> = {
  romantic: {
    name: 'The Romantic',
    description: 'You value love and deep connections.',
    icon: '../../assets/heart.png',
  },
  adventurer: {
    name: 'The Adventurer',
    description: 'You seek excitement and new experiences.',
    icon: '../../assets/compass.png',
  },
  intellectual: {
    name: 'The Intellectual',
    description: 'You enjoy thoughtful discussions and knowledge.',
    icon: '../../assets/book.png',
  },
  caregiver: {
    name: 'The Caregiver',
    description: 'You are compassionate and care for others.',
    icon: '../../assets/careGiver.png',
  },
  funSeeker: {
    name: 'The Fun-Seeker',
    description: 'You love fun and social activities.',
    icon: '../../assets/party-popper.png',
  },
  realist: {
    name: 'The Realist',
    description: 'You are practical and grounded.',
    icon: '../../assets/balance-sheet.png',
  },
};

const questions: Question[] = [
  {
    question: 'What would be your ideal way to spend a weekend?',
    options: [
      {text: 'Having a romantic dinner by candlelight.', score: 'romantic'},
      {
        text: 'Going on a spontaneous adventure like hiking or exploring a new city.',
        score: 'adventurer',
      },
      {
        text: 'Spending time reading a book or engaging in a creative hobby.',
        score: 'intellectual',
      },
      {
        text: 'Helping a friend in need or volunteering at a local shelter.',
        score: 'caregiver',
      },
      {
        text: 'Attending a fun event or party with friends.',
        score: 'funSeeker',
      },
      {text: 'Relaxing at home and watching movies.', score: 'realist'},
    ],
  },
  {
    question: 'How do you feel about public displays of affection?',
    options: [
      {text: 'I love them; they show how much you care!', score: 'romantic'},
      {
        text: 'A little is fine, but I prefer to keep it private.',
        score: 'adventurer',
      },
      {text: "I think it's nice but not necessary.", score: 'intellectual'},
      {text: 'I’m not comfortable with them at all.', score: 'caregiver'},
      {
        text: 'It depends on the situation; I’m open to it.',
        score: 'funSeeker',
      },
      {
        text: 'I think they can be fun, but I don’t need them.',
        score: 'realist',
      },
    ],
  },
  {
    question: 'What do you value most in a partner?',
    options: [
      {text: 'Romantic gestures and thoughtfulness.', score: 'romantic'},
      {text: 'A sense of adventure and spontaneity.', score: 'adventurer'},
      {text: 'Intelligence and engaging conversations.', score: 'intellectual'},
      {text: 'Kindness and compassion towards others.', score: 'caregiver'},
      {
        text: 'A fun-loving personality and sense of humor.',
        score: 'funSeeker',
      },
      {text: 'Practicality and stability in life.', score: 'realist'},
    ],
  },
  {
    question: 'If you had to choose a travel destination, where would you go?',
    options: [
      {text: 'A romantic getaway to Paris or Venice.', score: 'romantic'},
      {text: 'A backpacking trip through the mountains.', score: 'adventurer'},
      {text: 'A cultural trip to a historical city.', score: 'intellectual'},
      {text: 'A volunteering trip to help a community.', score: 'caregiver'},
      {text: 'An amusement park for thrills and fun.', score: 'funSeeker'},
      {text: 'A quiet beach for relaxation.', score: 'realist'},
    ],
  },
  {
    question: 'How do you handle conflicts in a relationship?',
    options: [
      {
        text: 'I prefer to talk it out openly and find a solution together.',
        score: 'romantic',
      },
      {
        text: 'I like to take a break to cool off before discussing.',
        score: 'adventurer',
      },
      {
        text: 'I analyze the situation and try to understand all perspectives.',
        score: 'intellectual',
      },
      {
        text: 'I tend to avoid confrontation and keep the peace.',
        score: 'caregiver',
      },
      {
        text: 'I express my feelings through humor to lighten the mood.',
        score: 'funSeeker',
      },
      {
        text: 'I focus on finding a practical solution rather than discussing feelings.',
        score: 'realist',
      },
    ],
  },
];

export default function PersonalityTest({route}: {route: any}) {
  const {setShowPaymentNavigator} = route.params;

  const {theme} = useCustomTheme();
  const styles = getStyles(theme);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [scores, setScores] = useState<PersonalityScores>({
    romantic: 0,
    adventurer: 0,
    intellectual: 0,
    caregiver: 0,
    funSeeker: 0,
    realist: 0,
  });
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [selectedTieOption, setSelectedTieOption] = useState<
    keyof PersonalityScores | null
  >(null);

  const handleAnswer = (score: keyof PersonalityScores) => {
    setScores(prevScores => {
      const updatedScores = {...prevScores, [score]: prevScores[score] + 1};

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        const sortedScores = Object.values(updatedScores).sort((a, b) => b - a);

        if (sortedScores[0] === sortedScores[1]) {
          setSelectedTieOption(null);
        } else {
          const highestScorePersonality = Object.keys(updatedScores).reduce(
            (highest, current) => {
              return updatedScores[current as keyof PersonalityScores] >
                updatedScores[highest as keyof PersonalityScores]
                ? current
                : highest;
            },
            Object.keys(updatedScores)[0],
          ) as keyof PersonalityScores;

          setSelectedTieOption(highestScorePersonality);
        }

        setQuizFinished(true);
      }

      return updatedScores;
    });
  };

  const getResult = () => {
    const highestScore = Math.max(...Object.values(scores));
    const tiedPersonalities = (
      Object.keys(scores) as Array<keyof PersonalityScores>
    ).filter(key => scores[key] === highestScore);

    return {tiedPersonalities, highestScore};
  };

  const result = getResult();

  return (
    <View style={styles.container}>
      {quizFinished ? (
        <View>
          {selectedTieOption ? (
            <>
              <LottieView
                source={require('../../assets/confetti.json')}
                autoPlay
                loop={false}
                style={{
                  width: 350,
                  height: 700,
                  position: 'absolute',
                  top: -300,
                }}
              />
              <View style={{display: 'flex', flexDirection: 'column'}}>
                <Text style={styles.questionText}>
                  Your personality type is:{'\n'}
                </Text>
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={personalityIcons[selectedTieOption]}
                    style={styles.iconImage}
                  />
                  <Text style={styles.questionText}>
                    {personalityTypes[selectedTieOption].name}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={async () => {
                  try {
                    await userService.updateUserData(
                      {
                        personality: personalityTypes[selectedTieOption].name,
                      },
                      '',
                    );
                    setCurrentQuestion(0);
                    setScores({
                      romantic: 0,
                      adventurer: 0,
                      intellectual: 0,
                      caregiver: 0,
                      funSeeker: 0,
                      realist: 0,
                    });
                    setQuizFinished(false);
                    setSelectedTieOption(null);
                   
                    setShowPaymentNavigator(false);
                  } catch (error) {
                    console.error('Error updating user data:', error);
                  }
                }}>
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View>
              <Text style={styles.questionText}>
                Which description suits you the best?
              </Text>
              {result.tiedPersonalities.map((key, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.button}
                  onPress={() => setSelectedTieOption(key)}>
                  <Text style={styles.buttonText}>
                    {personalityTypes[key].description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ) : (
        <ScrollView>
          <View style={styles.viewContainer}>
            <Text style={styles.numberText}>
              Question {currentQuestion + 1} out of 5
            </Text>
            <Text style={styles.questionText}>
              {questions[currentQuestion].question}
            </Text>
          </View>
          {questions[currentQuestion].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => handleAnswer(option.score)}>
              <Text style={styles.buttonText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const getStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      backgroundColor: '#B31E39',
    },
    questionText: {
      fontSize: 24,
      marginBottom: 25,
      color: 'white',
      textAlign: 'center',
    },
    numberText: {
      fontSize: 18,
      marginBottom: 10,
      color: '#DF7D87',
    },
    resultText: {
      fontSize: 28,
      textAlign: 'center',
      marginBottom: 20,
    },
    viewContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 30,
      marginTop: 80,
    },
    button: {
      backgroundColor: 'white',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 13,
      paddingBottom: 13,
      borderRadius: 8,
      marginBottom: 10,
      alignItems: 'center',
    },
    continueButton: {
      backgroundColor: 'white',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 13,
      paddingBottom: 13,
      borderRadius: 8,
      marginTop: 30,
      marginBottom: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: '#E94057',
      textAlign: 'center',
      fontSize: 17,
    },
    iconImage: {
      width: 50,
      height: 50,
      resizeMode: 'contain',
      marginBottom: 10,
    },
  });
