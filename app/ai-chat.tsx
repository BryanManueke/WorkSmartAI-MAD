import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../stores';
import { useAction, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
}

export default function AiChatScreen() {
  const router = useRouter();
  const { mode, data } = useLocalSearchParams();
  const { user } = useUserStore();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  // Convex Actions
  const chatAction = useAction(api.ai.chat);
  const analyzeAction = useAction(api.ai.analyzeResume);
  const userProfile = useQuery(api.users.getProfile, user?._id ? { userId: user._id as any } : "skip" as any);

  useEffect(() => {
    if (mode === 'analyze' && data) {
      const resumeData = JSON.parse(data as string);
      handleInitialAnalysis(resumeData);
    } else {
      setMessages([
        {
          id: '1',
          text: `Halo ${user?.name?.split(' ')[0] || ''}! Saya WorkSmart AI Advisor. Ada yang bisa saya bantu tentang karirmu hari ini?`,
          sender: 'ai'
        }
      ]);
    }
  }, [mode, data]);

  const handleInitialAnalysis = async (resumeData: any) => {
    setMessages([
      {
        id: '1',
        text: `Halo ${user?.name?.split(' ')[0] || ''}! Saya sedang menganalisis resumemu menggunakan Gemini AI...`,
        sender: 'ai'
      }
    ]);
    setIsLoading(true);

    try {
      const result = await analyzeAction({ resumeData });
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: result,
        sender: 'ai'
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "Maaf, saya gagal menganalisis resumemu saat ini. Silakan coba lagi nanti.",
        sender: 'ai'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText('');
    Keyboard.dismiss();
    setIsLoading(true);

    try {
      // Strip `id` field — Convex validator only accepts { sender, text }
      const historyPayload = messages.slice(-6).map(({ sender, text }) => ({ sender, text }));

      const response = await chatAction({
        message: currentInput,
        history: historyPayload,
        userProfile: userProfile
      });

      const aiMsg: Message = { id: (Date.now() + 1).toString(), text: response, sender: 'ai' };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error: any) {
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: "Terjadi gangguan koneksi. Mohon pastikan API Key Gemini sudah terpasang di dashboard Convex.", 
        sender: 'ai' 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleBox}>
             <Ionicons name="sparkles" size={20} color="#FFFFFF" />
             <Text style={styles.headerTitle}>WorkSmart AI Advisor</Text>
          </View>
        </View>

        <ScrollView 
          contentContainerStyle={styles.chatContainer} 
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(msg => (
            <View 
              key={msg.id} 
              style={[
                styles.messageBubble, 
                msg.sender === 'user' ? styles.userBubble : styles.aiBubble
              ]}
            >
              <Text style={msg.sender === 'user' ? styles.userText : styles.aiText}>
                {msg.text}
              </Text>
            </View>
          ))}
          {isLoading && (
            <View style={[styles.messageBubble, styles.aiBubble, { width: 60 }]}>
              <ActivityIndicator size="small" color="#1A73E8" />
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tanyakan apa saja tentang karirmu..."
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity 
            style={[styles.sendBtn, !inputText.trim() && { backgroundColor: '#A0C3FF' }]} 
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A73E8',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
  },
  backBtn: {
    marginRight: 16,
  },
  headerTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 20,
    marginBottom: 12,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E8F1FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#1A73E8',
    borderBottomRightRadius: 4,
  },
  aiText: {
    color: '#202124',
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F3F4',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#F8F9FA',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 15,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E8EAED',
  },
  sendBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1A73E8',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

