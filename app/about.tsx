import { Text, ScrollView, View, Button, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native'
import React, {useState} from 'react'
import { Link } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';
interface DiagnosisResult {
  Diagnosis: string;
  'Tingkat Keparahan': string;
  'Persentasi keyakinan (%)': number; // Perhatikan spasi dan tanda kurung di key
  Gejala: string;
  Perawatan: string;
}

const PadiKuScreen = () => {
  // --- SEMUA STATE HARUS DI DALAM KOMPONEN ---
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // State analysisResult harus bertipe DiagnosisResult (objek)
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null); 
  
  // GANTI URL INI DENGAN URL NGROK ANDA YANG BARU DAN AKTIF
  const WEBHOOK_URL = 'https://legally-busy-gelding.ngrok-free.app/webhook-test/7dcdf2f1-36d4-4ce2-876b-ae1937c83dce'; 

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Izin Kamera Diperlukan',
        'Aplikasi ini memerlukan izin untuk mengakses kamera Anda untuk mengambil gambar.'
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // <-- Dikembalikan
      allowsEditing: true, 
      quality: 0.7, 
      aspect: [4, 3] // Penting jika allowsEditing true
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setDiagnosisResult(null); // Reset hasil saat gambar baru diambil
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      Alert.alert('Peringatan', 'Harap ambil gambar terlebih dahulu.');
      return;
    }

    setIsAnalyzing(true); 
    setDiagnosisResult(null); // Reset hasil saat analisis baru dimulai

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: image,
        name: 'padi_diagnosis_image.jpg', 
        type: 'image/jpeg', 
      } as any);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json', // Memberitahu server kita mau JSON
        },
      });

      // --- Logika Penanganan Respons yang Disederhanakan dan Benar ---
      if (response.ok) {
        const responseData: DiagnosisResult = await response.json(); 
        console.log('RESPONS DARI N8N:', JSON.stringify(responseData, null, 2));

        // Simpan objek respons lengkap ke state diagnosisResult
        setDiagnosisResult(responseData); 

        Alert.alert('Berhasil', 'Analisis Selesai!'); // Pesan sukses singkat

      } else {
        const errorText = await response.text(); 
        console.error('Analisis gagal dari server:', response.status, errorText);
        Alert.alert('Gagal', `Analisis gambar gagal. Server merespon: ${response.status}\n${errorText}`);
      }
      // --- Akhir Logika Penanganan Respons ---

    } catch (error) {
      console.error('Terjadi kesalahan saat mengirim gambar:', error);
      Alert.alert('Error', 'Tidak dapat terhubung ke server atau terjadi kesalahan jaringan. Pastikan URL ngrok aktif!');
    } finally {
      setIsAnalyzing(false); 
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View>
        <Text style={styles.title}>Diagnosis Penyakit Padi</Text>
      </View>

      <View style={styles.buttonWrapper}>
        <Button title="Ambil Foto" onPress={takePicture} color="#4CAF50" disabled={isAnalyzing} />
      </View>

      {image && (
        <View style={styles.imageContainer}>
          <Text style={styles.imageLabel}>Gambar yang diambil:</Text>
          <Image source={{ uri: image }} style={styles.previewImage} />
          <View style={styles.buttonWrapper}>
            <Button
              title={isAnalyzing ? "Menganalisis..." : "Analisis Gambar"}
              onPress={analyzeImage}
              color="#00C853"
              disabled={isAnalyzing}
            />
            {isAnalyzing && <ActivityIndicator size="small" color="#00C853" style={styles.loadingIndicator} />}
          </View>
        </View>
      )}

      {/* Tampilkan hasil diagnosis lengkap jika ada */}
      {diagnosisResult && (
        <View style={styles.resultCard}>
          <Text style={styles.resultCardTitle}>Hasil Diagnosis:</Text>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Diagnosis:</Text>
            <Text style={styles.resultValue}>{diagnosisResult.Diagnosis}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Tingkat Keparahan:</Text>
            <Text style={styles.resultValue}>{diagnosisResult['Tingkat Keparahan']}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Keyakinan:</Text>
            <Text style={styles.resultValue}>{diagnosisResult['Persentasi keyakinan (%)']}%</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Gejala:</Text>
            <Text style={styles.resultValue}>{diagnosisResult.Gejala}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Perawatan:</Text>
            <Text style={styles.resultValue}>{diagnosisResult.Perawatan}</Text>
          </View>
        </View>
      )}

      <View style={styles.buttonWrapper}>
        <Link href="/" asChild>
          <Button title="Kembali ke Beranda" color="#2E7D32" disabled={isAnalyzing} />
        </Link>
      </View>
    </ScrollView>
  );
};

// ... (Styles Anda tetap sama) ...
const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#2E7D32',
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '80%',
    marginBottom: 15,
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  imageLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  previewImage: {
    width: 250,
    height: 250,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  loadingIndicator: {
    marginTop: 10,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2E7D32',
    textAlign: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
    minWidth: 100,
  },
  resultValue: {
    fontSize: 16,
    color: '#555',
    flexShrink: 1,
  },  
});

export default PadiKuScreen;