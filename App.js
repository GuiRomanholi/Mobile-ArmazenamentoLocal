import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  const[nomeProduto, setNomeProduto] = useState("")
  const[precoProduto, setPrecoProduto] = useState()
  const[dados, setDados] = useState([])
  const[produtoEditado,setProdutoEditado] = useState(null)

  useEffect(()=>{
    buscarDados()
  },[])

  async function Salvar(){
    Keyboard.dismiss()
    let produtos = []

    //Carregar os produtos que estão em PRODUTOS
    if (await AsyncStorage.getItem("PRODUTOS") != null) {
      produtos = JSON.parse(await AsyncStorage.getItem("PRODUTOS"))
    }
    
    if (produtoEditado) {
      produtos[produtoEditado.index] = { nome: nomeProduto, preco: precoProduto }
    } else {
      //Adiciona no Array
      produtos.push({ nome: nomeProduto, preco: precoProduto })
    }

    //Salvandos dados no Async Storage
    await AsyncStorage.setItem("PRODUTOS", JSON.stringify(produtos))

    alert(produtoEditado?"PRODUTO ATUALIZADO!": "PRODUTO CADASTRADO!")
    setProdutoEditado(null)

    //Limpando o formulário
    setNomeProduto('')
    setPrecoProduto('')

    buscarDados()
  }

  async function buscarDados(){
    const p = await AsyncStorage.getItem("PRODUTOS")
    setDados(JSON.parse(p))
    console.log(p)
  }

  async function deletarProduto(index) {
    const tempDados = dados
    const dadosAtualizado = tempDados.filter((item, ind)=>{
      return ind!==index
    })
    setDados(dadosAtualizado)
    await AsyncStorage.setItem("PRODUTOS", JSON.stringify(dadosAtualizado))
  }

  function editarProduto(index){
    const produto = dados[index]
    setNomeProduto(produto.nome)
    setPrecoProduto(produto.preco)
    setProdutoEditado({index})
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
        <Text style={{color:"white"}}>{produtoEditado?"ATUALIZAR":"CADASTRAR"}</Text>
      </TouchableOpacity>

      <FlatList
        data={dados}
        renderItem={({item,index})=>{
          if(!item || !item.nome) return null;
          return(            
            <View style={styles.listarFlat}>
              <View>
                <Text>NOME: {item.nome} - PREÇO: {item.preco}</Text>
              </View>
              <View style={{flexDirection: "row"}}>

                <TouchableOpacity 
                style={styles.btnExcluir}
                onPress={()=>deletarProduto(index)}
                >
                  <Text>Excluir</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                style={styles.btnEditar}
                onPress={()=>editarProduto(index)}
                >
                  <Text>Editar</Text>
                </TouchableOpacity>

              </View>
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
  },
  btnExcluir: {
    backgroundColor: "red",
    width: 100,
    borderRadius: 15,
    alignItems: "center",
    height: 21,
    marginTop: 7
  },
  btnEditar: {
    backgroundColor: "orange",
    width: 100,
    borderRadius: 15,
    alignItems: "center",
    height: 21,
    marginTop: 7
  }
});
