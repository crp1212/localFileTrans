import React, { Component } from 'react'
import Ws from '../util/ws.js'

class Upload extends Component {
    constructor (props) {
        super(props)
        this.state = {}
    }
    componentDidMount () {
        this.ws = new Ws('ws://192.168.11.234:1591')
    }

    readFile (file) {
        return new Promise((resolve, reject) => {
            var FReader = new FileReader()
            FReader.readAsArrayBuffer(file)
            FReader.onloadend = (data) => {
                var dataObj = new Int8Array(data.currentTarget.result)
                var arr = []
                for (var i = 0; i < dataObj.length; i++) {
                    arr[i] = dataObj[i]
                }
                resolve({
                    data: arr,
                    name: file.name
                })
            }
        }) 
    }

    async getFilesArrayBufferData (files) {
        var data = []
        for (var i = 0, len = files.length; i < len; i++) {
            var obj = await this.readFile(files[i])
            data.push(obj)
        }
        return data
    }

    btnClick () {
        this.refs['file'].click()
    }

    async uploadFile () {
        var data = await this.getFilesArrayBufferData(this.refs['file'].files)
        this.ws.send('file', {data}, () => {
            alert('上传完成')
        })
    }

    render () {
        return (
            <div className="container" style = { styles.container }>
                <button className="btn" onClick={ this.btnClick.bind(this) }>文件上传</button>
                <input type="file" style = { styles.fileInput } multiple ref={ 'file' } onChange={ this.uploadFile.bind(this) }/>
            </div>
        )
    }
}
var styles = {
    container: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px'
    },
    fileInput: {
        display: 'none'
    }
}
export default Upload