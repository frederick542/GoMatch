import React, {useRef, useState, useEffect} from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Chat from '../../../models/Chat';
import useCustomTheme from '../../../hooks/useCustomTheme';
import CustomTheme from '../../../models/CustomTheme';
import useAsyncHandler from '../../../hooks/useAsyncHandler';
import MessageService from '../../../services/messageService';
import Message from '../../../models/Message';
import CustomButton from '../../../components/CustomButton';
import ChatBubble from './ChatBubble';
import {renderProfileImage} from '../../../utils/imageUtils';
import useAuth from '../../../hooks/useAuth';
import {fetchUserDoc} from './userFetcher';
import User from '../../../models/User';
import UserService from '../../../services/userService';

interface Props {
  chatDoc: Chat;
  handleSelectChat: (chatId: string) => void;
}

interface Location {
  id: number;
  name: string;
  description: string;
}

const messageService = MessageService();
const userService = UserService();
export default function ChatModal({chatDoc, handleSelectChat}: Props) {
  const {user} = useAuth();

  const to = chatDoc.to;
  const {theme} = useCustomTheme();
  const styles = getStyles(theme);
  const [messages, setMessages] = useState<Message[]>([]);
  const [textMessage, setTextMessage] = useState('');
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [otherUserDoc, setOtherUserDoc] = useState<User | null>(null);
  const [personalityState, setPersonalityState] = useState<string | null>(null);
  useEffect(() => {
    async function getOtherUserDoc() {
      const toEmail = chatDoc.to.email;
      if (toEmail) {
        const fetchedUserDoc = await fetchUserDoc(toEmail);
        setOtherUserDoc(fetchedUserDoc ?? null);
      }
    }

    getOtherUserDoc();
  }, [chatDoc]);

  useEffect(() => {
    if (otherUserDoc) {
      setPersonalityState(otherUserDoc.personality);
    }
  }, [otherUserDoc]);

  const locations1 = [
    {
      id: 1,
      name: 'Starbucks Coffee',
      description: 'A cozy coffee shop with great ambiance.',
    },
    {
      id: 2,
      name: 'Kintan',
      description: 'A modern restaurant offering international cuisine.',
    },
    {
      id: 3,
      name: 'Holland Bakery',
      description: 'A small bakery known for its fresh pastries.',
    },
  ];

  const locations2 = [
    {
      id: 1,
      name: 'Pasta Fresca',
      description: 'An Italian eatery specializing in handmade pasta dishes.',
    },
    {
      id: 2,
      name: 'Blooming Florals',
      description:
        'A florist with a beautiful variety of fresh flowers and bouquets.',
    },
    {
      id: 3,
      name: 'Zen Spa',
      description: 'A tranquil spa offering massages and relaxation therapies.',
    },
  ];

  const locations3 = [
    {
      id: 1,
      name: 'The Book Nook',
      description: 'A quaint bookstore with a cozy reading corner.',
    },
    {
      id: 2,
      name: 'FitPro Gym',
      description:
        'A modern gym with top-notch equipment and personal trainers.',
    },
    {
      id: 3,
      name: 'Picasso Art Gallery',
      description: 'An art gallery showcasing contemporary works.',
    },
  ];

  const locations4 = [
    {
      id: 1,
      name: 'Green Grocer',
      description:
        'A local grocery store offering fresh produce and organic items.',
    },
    {
      id: 2,
      name: 'Sea Breeze Diner',
      description:
        'A family-owned diner with a coastal theme and seafood dishes.',
    },
    {
      id: 3,
      name: 'Starlight Cinema',
      description: 'A small movie theater with a retro ambiance.',
    },
  ];

  const locations5 = [
    {
      id: 1,
      name: 'Java Juice Bar',
      description:
        'A juice bar serving fresh fruit smoothies and wellness shots.',
    },
    {
      id: 2,
      name: 'Mountain Sports',
      description: 'A store specializing in outdoor and sports equipment.',
    },
    {
      id: 3,
      name: 'Tech Zone',
      description:
        'An electronics shop with the latest gadgets and accessories.',
    },
  ];

  const locations6 = [
    {
      id: 1,
      name: 'Sunset Lounge',
      description:
        'A rooftop bar offering panoramic city views and signature cocktails.',
    },
    {
      id: 2,
      name: 'Purrfect Pets',
      description: 'A pet store with a range of supplies and adorable pets.',
    },
    {
      id: 3,
      name: 'Creative Crafts',
      description:
        'A craft store stocked with supplies for all kinds of projects.',
    },
  ];

  const randomLocation = Math.floor(Math.random() * 6) + 1;
  let location: Location[] = [];

  if (personalityState == 'The Romantic') location = locations1;
  else if (personalityState == 'The Adventurer') location = locations2;
  else if (personalityState == 'The Intellectual') location = locations3;
  else if (personalityState == 'The Caregiver') location = locations4;
  else if (personalityState == 'The Fun-Seeker') location = locations5;
  else if (personalityState == 'The Realist') location = locations6;

  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  
  useEffect(() => {
    if (scrollViewRef.current && !isUserScrolling) {
      scrollViewRef.current.scrollToEnd({animated: false});
    }
  }, [messages]);

  const handleScroll = (val: boolean) => {
    setIsUserScrolling(val);
  };

  const {executeAsync: handleSendMessage} = useAsyncHandler(async function () {
    if (textMessage !== '') {
      await messageService.sendMessage(to.email, textMessage, chatDoc.chatRef);
      textInputRef.current?.clear();
      textInputRef.current?.blur();
      setTextMessage('');
    }
  });

  useEffect(() => {
    const subscribe = chatDoc.chatRef
      .collection('messages')
      .orderBy('timestamp')
      .limitToLast(100)
      .onSnapshot(querySnapshot => {
        const newMessages: Message[] = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          newMessages.push({
            id: doc.id,
            from: data.from,
            message: data.message,
            timestamp: new Date(data.timestamp),
          });
        });
        setMessages(newMessages);
      });
    return () => subscribe();
  }, []);

  const handleSelectLocation = (location: any) => {
    setTextMessage(`How about we meet at ${location.name}?`);
    setIsLocationModalVisible(false);
  };
  const [isChatModalVisible, setIsChatModalVisible] = useState(true);
  const [isBlockReportModalVisible, setIsBlockReportModalVisible] =
    useState(false);
  const [blockReason, setBlockReason] = useState(''); 
  const [isReasonModalVisible, setIsReasonModalVisible] = useState(false);

  return (
    <>
      {/* Main Chat Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => handleSelectChat('')}>
        <TouchableWithoutFeedback onPress={() => handleSelectChat('')}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.profileInformation}>
                  <Image
                    style={styles.profileImage}
                    source={renderProfileImage(to.profileImage)}
                  />
                  <View style={styles.profileDetail}>
                    <Text style={styles.displayName}>{to.name}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setIsChatModalVisible(false);
                      setIsBlockReportModalVisible(true);
                    }}>
                    <Image
                      source={require('../../../assets/block.png')}
                      style={styles.blockIcon}
                    />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.chatBubbleList}
                  ref={scrollViewRef}
                  onScrollBeginDrag={() => handleScroll(true)}
                  onScrollEndDrag={() => handleScroll(false)}>
                  {[...messages.values()].map(message => (
                    <ChatBubble
                      key={message.id}
                      message={message}
                      to={chatDoc.to}
                    />
                  ))}
                </ScrollView>

                <View style={styles.messageControlContainer}>
                  <View style={styles.messageControlContent}>
                    <TouchableOpacity
                      onPress={() => setIsLocationModalVisible(true)}
                      style={styles.locationButton}>
                      <Image
                        source={require('../../../assets/map.png')}
                        style={{width: 30, height: 30}}
                      />
                    </TouchableOpacity>
                    <TextInput
                      value={textMessage}
                      onChangeText={setTextMessage}
                      style={styles.textMessageInputBox}
                      placeholder="Your Message"
                      placeholderTextColor={'gray'}
                      multiline={true}
                      ref={textInputRef}
                    />
                    <CustomButton
                      style={styles.sendBtn}
                      onPress={handleSendMessage}>
                      <Image source={require('../../../assets/sendbtn.png')} />
                    </CustomButton>
                  </View>
                </View>

                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={isLocationModalVisible}
                  onRequestClose={() => setIsLocationModalVisible(false)}>
                  <TouchableWithoutFeedback
                    onPress={() => setIsLocationModalVisible(false)}>
                    <View style={styles.locationModalBackground}>
                      <View style={styles.locationModalContent}>
                        <FlatList
                          data={location}
                          keyExtractor={item => item.id.toString()}
                          renderItem={({item}) => (
                            <TouchableOpacity
                              style={styles.locationItem}
                              onPress={() => handleSelectLocation(item)}>
                              <Text style={styles.locationName}>
                                {item.name}
                              </Text>
                              <Text style={styles.locationDescription}>
                                {item.description}
                              </Text>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Block Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isBlockReportModalVisible}
        onRequestClose={() => setIsBlockReportModalVisible(false)}>
        <TouchableWithoutFeedback
          onPress={() => setIsBlockReportModalVisible(false)}>
          <View style={styles.modalContainerBlock}>
            <View style={styles.modalContentBlock}>
              <Text style={styles.modalTitle}>Block and Report Match</Text>
              <Text style={styles.modalText}>
                Once you block and report you won’t meet the same person again
              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setIsBlockReportModalVisible(false);
                    setIsChatModalVisible(true);
                  }}>
                  <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsBlockReportModalVisible(false); 
                    setIsReasonModalVisible(true); 
                  }}>
                  <Text style={styles.blockButton}>Block and Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isReasonModalVisible}
        onRequestClose={() => setIsReasonModalVisible(false)}>
        <TouchableWithoutFeedback
          onPress={() => setIsReasonModalVisible(false)}>
          <View style={styles.modalContainerBlock}>
            <View style={styles.modalContentBlock}>
              <Text style={styles.modalTitle}>Block Reason</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter your reason for blocking"
                placeholderTextColor="gray"
                multiline
                value={blockReason}
                onChangeText={setBlockReason}
              />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setIsReasonModalVisible(false);
                    setIsChatModalVisible(true);
                    setBlockReason(''); 
                  }}>
                  <Text style={styles.cancelButton}>Cancel Block</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (otherUserDoc?.email)
                      userService.block(
                        otherUserDoc?.email,
                        blockReason,
                        chatDoc.chatId,
                      );
                    setIsReasonModalVisible(false); 
                    setBlockReason(''); 
                  }}>
                  <Text style={styles.blockButton}>Confirm Block</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}


function getStyles(theme: CustomTheme) {
  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '30%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      position: 'relative',
      flex: 1,
      backgroundColor: theme.background,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      alignItems: 'center',
      elevation: 5,
      width: '100%',
    },
    profileInformation: {
      display: 'flex',
      flexDirection: 'row',
      paddingVertical: 30,
      paddingHorizontal: 10,
      gap: 10,
      width: '90%',
      justifyContent: 'flex-start',
      borderBottomColor: 'gray',
      borderBottomWidth: 0.5,
    },
    profileImage: {
      width: 75,
      height: 75,
      borderRadius: 50,
    },
    profileDetail: {
      flex: 1,
      padding: 10,
      justifyContent: 'flex-start',
    },
    displayName: {
      width: 'auto',
      color: theme.text,
      fontSize: 24,
      fontFamily: 'ABeeZee',
    },
    chatBubbleList: {
      height: '100%',
      width: '100%',
      marginBottom: 100,
    },
    messageControlContainer: {
      position: 'absolute',
      width: '100%',
      height: 100,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.background,
    },
    messageControlContent: {
      width: '80%',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    textMessageInputBox: {
      flex: 1,
      borderWidth: 0.5,
      borderColor: 'gray',
      borderRadius: 15,
      paddingHorizontal: 15,
      paddingVertical: 15,
      fontSize: 18,
      width: '80%',
      fontFamily: 'ABeeZee',
      color: theme.text,
    },
    sendBtn: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
      width: 50,
      height: 50,
      padding: 5,
      borderWidth: 0.3,
      borderColor: 'gray',
      borderRadius: 10,
    },
    locationModalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    locationModalContent: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 15,
      padding: 20,
    },
    locationItem: {
      paddingVertical: 15,
      borderBottomWidth: 0.5,
      borderBottomColor: 'gray',
    },
    locationName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'black',
    },
    locationDescription: {
      fontSize: 14,
      color: 'gray',
    },
    locationButton: {
      padding: 1,
      tintColor: theme.primary,
    },
    blockIcon: {
      width: 32,
      height: 32,
      margin: 10,
      tintColor: '#FF4C4C',
    },
    modalContainerBlock: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    modalContentBlock: {
      width: 300,
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5, 
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
      textAlign: 'center',
    },
    modalText: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
      marginBottom: 20,
    },
    modalButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    cancelButton: {
      color: '#007bff', 
      fontSize: 16,
      fontWeight: 'bold',
      padding: 10,
    },
    blockButton: {
      color: '#ff0000',
      fontSize: 16,
      fontWeight: 'bold',
      padding: 10,
    },
    inputBox: {
      height: 80,
      width: '100%',
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      color:  "black",
      textAlignVertical: 'top', 
      marginBottom: 20,
    },
  });
}
