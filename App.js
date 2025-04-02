import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  const[nomeProduto, setNomeProduto] = useState("")
  const[precoProduto, setPrecoProduto] = useState()
  const[dados, setDados] = useState([])

  async function Salvar(){
    let produtos = []

    if(await AsyncStorage.getItem("PRODUTOS") != null){
      produtos = JSON.parse(await AsyncStorage.getItem("PRODUTOS"))
    }
    //Adiciona no Array
    produtos.push({nome:nomeProduto, preco:precoProduto})
    //Salvando dados no Async Storage
    await AsyncStorage.setItem("PRODUTOS", JSON.stringify(produtos))

    alert("PRODUTO CADASTRADO")
    buscarDados()
  }

  async function buscarDados(){
    const p = await AsyncStorage.getItem("PRODUTOS")
    setDados(JSON.parse(p))
    console.log(p)
  }

  return (
    <View style={styles.container}>
      <Text>Cadastro</Text>
      <TextInput
        placeholder='Digite o nome do Produto'
        style ={styles.input}
        value={nomeProduto}
        onChangeText={(value)=>setNomeProduto(value)}
      />
      <TextInputMask
        type='money'
        placeholder='Digite o preço do Produto'
        style ={styles.input}
        value={precoProduto}
        onChangeText={(value)=>setPrecoProduto(value)}
      />

      <TouchableOpacity style={styles.btn} onPress={Salvar}>
        <Text style={{color:"white"}}>CADASTRAR</Text>
      </TouchableOpacity>

      <FlatList
        data={dados}
        renderItem={({item,index})=>{
          return(
            <View style={styles.listarFlat}>
              <Text>NOME: {item.nome} - PREÇO: {item.preco}</Text>
            </View>
          )
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 50
  },
  input: {
    borderWidth:1,
    height:50,
    width:300,
    borderRadius:15,
    marginTop:10
  },
  btn: {
    backgroundColor: "blue",
    height:50,
    width:200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius:15,
    marginTop: 10
  },
  listarFlat: {
    width: 300,
    borderWidth: 1,
    height: 80,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 3,
    marginTop: 10,
    borderRadius: 10
  }
});
