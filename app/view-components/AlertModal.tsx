// components/AlertModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface AlertModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  type?: 'success' | 'error' | 'warning' | 'info';
}

const AlertModal: React.FC<AlertModalProps> = ({ 
  visible, 
  message, 
  onClose,
  type = 'info' 
}) => {
  const getModalColor = () => {
    switch (type) {
      case 'success':
        return '#3b873e';
      case 'error':
        return '#dc3545';
      case 'warning':
        return '#ffc107';
      default:
        return '#3b873e';
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity 
            style={[styles.modalButton, { backgroundColor: getModalColor() }]} 
            onPress={onClose}
          >
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: Dimensions.get('window').width * 0.8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    lineHeight: 22,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AlertModal;
