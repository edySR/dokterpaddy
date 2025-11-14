import { Link,Stack} from "expo-router";
import { Text, View,Image, Button, StyleSheet} from "react-native";


export default function Index() {
  return (
    
    <View style={styles.container}>
      <Text style={styles.judul}>
          Aplikasi
        </Text>
        <Text style={styles.subjudul}>Dokter Padi</Text>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo}></Image>
        <View style={{marginTop:40}} >
          <Link href="/about" asChild>
            <Button title="Go to About Page" color="#4CAF50" onPress={() => {}}  ></Button>
          </Link>
          <Text style={{textAlign:'center', marginTop: 20}}>Version 0.0.1</Text>
        </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1 ,
    backgroundColor:'white', 
    justifyContent:'center', 
    alignItems:'center'
  },
  judul:{
    fontSize: 44, 
    fontWeight: 'bold',
    color:'#2E7D32' 
  },
  subjudul:{
    fontSize: 34, 
    fontWeight: 'bold', 
    marginBottom: 20 , 
    color:'#4CAF50'
  },
  logo:{
    width: 140, 
    height: 205,
    resizeMode: 'contain',
  }

});


