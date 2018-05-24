# -*- coding: utf-8 -*-
import os
import random
from imp import reload

import pymysql
import time
# python 对zip文件操作的模块
import zipfile
import shutil
from flask import Flask, request, url_for, send_from_directory, json, jsonify, render_template
from werkzeug import secure_filename
import os, sys, string
from flask_sqlalchemy import SQLAlchemy
import xlrd
import chardet
from flask_bootstrap import Bootstrap
from PyPDF2 import PdfFileReader

reload(sys)
#sys.setdefaultencoding('utf-8')

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif', 'pdf', 'docx'])


app = Flask(__name__)
bootstrap = Bootstrap(app)
# 数据库的配置
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@127.0.0.1:3306/wx_info'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
# 文件保存目录的配置
app.config['UPLOAD_FOLDER'] = app.root_path
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
# 实例化
db = SQLAlchemy(app, use_native_unicode='utf8')

# 用户的数据库表
class User(db.Model):
    __tablename__ = 'user_info'

    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(20))
    openId = db.Column(db.String(64), unique=True)
    session_key = db.Column(db.String(64), unique=True)
    university_name = db.Column(db.String(20))
    phoneNumber = db.Column(db.String(12))
    userDirectory = db.Column(db.String(40), unique=True)

    def __init__(self, user_name, openId, session_key, university_name, phoneNumber, userDirectory):  # 插入新值的方法
        self.user_name = user_name
        self.openId = openId
        self.session_key = session_key
        self.university_name = university_name
        self.phoneNumber = phoneNumber
        self.userDirectory = userDirectory

    def __repr__(self):
        return '<Role %r>' % self.user_name
# 上传的文件的数据库表
class File(db.Model):
    __tablename__ = 'file_info'

    id = db.Column(db.Integer, primary_key=True)
    openId = db.Column(db.String(64))
    filename = db.Column(db.String(60))
    fileNumber = db.Column(db.String(40), unique=True)
    paperType = db.Column(db.String(2))
    paperSize = db.Column(db.String(2))
    bindingType = db.Column(db.String(2))
    pages = db.Column(db.Integer)
    isPrint = db.Column(db.Boolean)
    ifShared = db.Column(db.Boolean)

    def __init__(self, openId, filename, fileNumber, isPrint, ifShared, paperType,  paperSize, bindingType, pages):  # 插入新值的方法
        self.openId = openId
        self.filename = filename
        self.fileNumber = fileNumber
        self.paperType = paperType
        self.paperSize = paperSize
        self.bindingType = bindingType
        self.isPrint = isPrint
        self.ifShared = ifShared
        self.pages = pages

    def __repr__(self):
        return '<Role %r>' % self.filename

class Order(db.Model):
    __tablename__ = 'order_info'

    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(60))

# 学校数据库表
class University(db.Model):
    __tablename__ = 'university_names'

    id = db.Column(db.Integer, primary_key=True)
    university_name = db.Column(db.String(30), unique=True)

    def __init__(self, university_name):  # 插入新值的方法
        self.university_name = university_name

# 用户需打印上门数据库表
class Print(db.Model):
    __tablename__ = 'print_to_door'

    id = db.Column(db.Integer, primary_key=True)
    openId = db.Column(db.String(64))
    orderNumber = db.Column(db.String(40), unique=True)
    address = db.Column(db.String(40))
    phoneNumber = db.Column(db.String(12))
    isReceive = db.Column(db.Boolean)
    isPrint = db.Column(db.Boolean)

    def __init__(self, openId, orderNumber, address, isReceive, isPrint, phoneNumber):  # 插入新值的方法
        self.openId = openId
        self.orderNumber = orderNumber
        self.address = address
        self.isReceive = isReceive
        self.isPrint = isPrint
        self.phoneNumber = phoneNumber

    def __repr__(self):
        return '<Role %r>' % self.orderNumber

# 用户接收订单数据库表
class userRevOrder(db.Model):
    __tablename__ = 'userRevOrder'

    id = db.Column(db.Integer, primary_key=True)
    openId = db.Column(db.String(64))
    orderNumber = db.Column(db.String(40), unique=True)

    def __init__(self, openId, orderNumber):  # 插入新值的方法
        self.openId = openId
        self.orderNumber = orderNumber

    def __repr__(self):
        return '<userRevOrder %r>' % self.orderNumber

# 用户的消息数据库表
class userMessage(db.Model):
    __tablename__ = 'userMessage'

    id = db.Column(db.Integer, primary_key=True)
    openId = db.Column(db.String(64))
    # message = db.Column(db.TEXT)
    orderNumber = db.Column(db.String(40))
    fileName = db.Column(db.String(60))
    isReceive = db.Column(db.Boolean)
    time = db.Column(db.DateTime)

    def __init__(self, openId, orderNumber, fileName, isReceive, time):
        self.openId = openId
        self.orderNumber = orderNumber
        self.fileName = fileName
        self.isReceive = isReceive
        self.time = time

    def __repr__(self):
        return '<userMessage %r>' % self.id

# 创建数据库表
# db.drop_all()
db.create_all()


'''
#获得学校的列表并插入数据库
university_data = xlrd.open_workbook(r"/usr/local/nginx/html/weixin_proj/xxx.xls")
table = university_data.sheets()[0]
nrows = table.nrows
print (nrows)
university_list = []
for row in range(4, nrows):
    colnames = table.row_values(row)
    if (colnames[1] != ''):
        university = University(university_name=colnames[1])
        db.session.add(university)
        db.session.commit()
        university_list.append(colnames[1])
print (len(university_list))
'''

def allowed_file(filename):
    print (filename.rsplit('.', 1)[1] )
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)


@app.route('/', methods=['GET', 'POST'])
def upload_file1():
    if request.method == 'POST':
        # 随机生成的文件夹名临时存储用户上传文件
        local_time = time.strftime('%Y%m%d%H%M%S', time.localtime(time.time()))[2:]
        folderName = local_time  + str(random.randint(1000, 9999))
        # os.makedirs(app.config['UPLOAD_FOLDER'] + "/static/temDirectory/" + folderName)
        print (request)
        print (request.form)
        print (request.values)
        # print (request.content)
        print (request.files)

        file = request.files['fileField']
        if file and allowed_file(file.filename):
            os.makedirs(app.config['UPLOAD_FOLDER'] + "/static/temDirectory/" + folderName)
            os.makedirs(app.config['UPLOAD_FOLDER'] + "/static/getPagesDirectory/" + folderName)
            filename = file.filename
            file.save(app.config['UPLOAD_FOLDER'] + '/static/temDirectory/{}/{}'.format(folderName, filename))
            print (folderName)
            return render_template('success.html', folderNumber=folderName)
        else:
            return render_template('error.html')
    print (app.root_path)
    print (app.instance_path)
    return render_template('index.html')

# 上传文件
@app.route('/upload', methods=['GET' ,'POST'])
def upload_file():
    if request.method == 'POST':
        openId = json.loads(request.data)['openId']
        user = User.query.filter_by(openId=openId).first()
        print (type(user.userDirectory))
        ##### 存入用户文件夹
        # 不同用户单独文件夹存放文件
        folder = os.path.exists(app.config['UPLOAD_FOLDER'] + "/static/" + str(user.userDirectory))
        # user.userDirectory 来标识用户的文件夹
        print (folder)
        if not folder:
             os.makedirs(app.config['UPLOAD_FOLDER'] + "/static/" + user.userDirectory)
        # 对同一用户的文件进行编号区分
        filefolder = app.config['UPLOAD_FOLDER'] + "/static/" + user.userDirectory
        ifShared = json.loads(request.data)['ifShared']
        upload_time = json.loads(request.data)['time']
        FolderNumber = str(json.loads(request.data)['folderNumber'])
        # 纸张类型
        paperType = json.loads(request.data)['paperType']
        moneyPaperType = 0.2 if paperType == '0' else 0.5
        # 纸张尺寸
        paperSize = json.loads(request.data)['paperSize']
        # 装订类型
        bindingType = json.loads(request.data)['bindingType']
        if (bindingType == '1'):
            moneyBindingType = 1.
        elif(bindingType == '2'):
            moneyBindingType = 0
        else:
            moneyBindingType = 7.5

        # 获取文件名
        fileName = ''
        pages = 0
        if (os.path.exists(r"{}/static/temDirectory/{}/{}".format(app.config['UPLOAD_FOLDER'],FolderNumber, fileName))):

            for root, dirs, fileNameList in os.walk(
                    app.config['UPLOAD_FOLDER'] + "/static/temDirectory/" + FolderNumber):
                fileName = fileNameList[0]
                # print (chardet.detect(fileName))
                # print (fileName)
            if (ifShared == 'False'):
                ifShared = False
            else:
                ifShared = True
            print(ifShared)
            print(request.form)
            print("fileName类型：{}".format(type(fileName)))
            # 获取word文档的页数
            if (fileName.rsplit('.', 1)[1] in ['doc', 'docx']):
                filePagesPath = app.config['UPLOAD_FOLDER'] + '/static/getPagesDirectory/{}/'.format(FolderNumber)
                shutil.copy(app.config['UPLOAD_FOLDER'] + '/static/temDirectory/{}/{}'.format(FolderNumber, fileName),
                            filePagesPath)
                os.rename(filePagesPath + fileName, '{}xxx.zip'.format(filePagesPath))
                zipFile = zipfile.ZipFile("{}xxx.zip".format(filePagesPath))
                nameList = zipFile.namelist()
                print(nameList)
                print(type(nameList))
                index = nameList.index('docProps/app.xml')
                pageFileName = nameList[index]
                # 解压缩
                zipFile.extract(pageFileName, filePagesPath)
                newPath = '{}docProps/app.xml'.format(filePagesPath)
                with open(newPath, 'r') as f:
                    content = f.read()
                indexFront = content.index('</Pages>')
                pages = int(content[indexFront - 1])
                print("文件的页数：{}".format(pages))
                # 要关闭zipFile文件流 不认会报错 PermissionError: [WinError 32] 另一个程序正在使用此文件，进程无法访问。: 'C:\\Users\\wsc\\Desktop\\wx_back/static/getPagesDirectory/1805232243307867/xxx.zip'
                zipFile.close()
            elif (fileName.rsplit('.', 1)[1] in ['pdf']):
                filePagesPath = app.config['UPLOAD_FOLDER'] + '/static/getPagesDirectory/{}/'.format(FolderNumber)
                shutil.copy(app.config['UPLOAD_FOLDER'] + '/static/temDirectory/{}/{}'.format(FolderNumber, fileName),
                            filePagesPath)
                readFilePath = app.config['UPLOAD_FOLDER'] + '/static/getPagesDirectory/{}/{}'.format(FolderNumber, fileName)
                pdfFileReader = PdfFileReader(readFilePath)
                pages = pdfFileReader.getNumPages()
            else:
                filePagesPath = app.config['UPLOAD_FOLDER'] + '/static/getPagesDirectory/{}/'.format(FolderNumber)
                shutil.copy(app.config['UPLOAD_FOLDER'] + '/static/temDirectory/{}/{}'.format(FolderNumber, fileName),
                            filePagesPath)
                pages = 1
            # 总金额
            moneyAll =  moneyBindingType + pages * moneyPaperType
            # 文件编号的生成 利用当前时间和用户id和一个随机生成的4位数
            local_time = time.strftime('%Y%m%d%H%M%S', time.localtime(time.time()))[2:]
            id = user.id
            fileNumber = local_time + str(id) + str(random.randint(1000, 9999))
            ### 文件存入数据库
            file_info = File(openId=openId, filename=fileName, fileNumber=fileNumber, isPrint=False, ifShared=ifShared,
                             paperSize=paperSize, paperType=paperType, bindingType=bindingType, pages=pages)
            db.session.add(file_info)
            db.session.commit()
            ### 将文件存入目录
            a = File.query.filter_by(openId=openId).first()
            # print (a.filename)
            # print (a.openId)
            # 保存用户上传的文件至指定用户目录
            filePath = filefolder + "/" + str(fileName)

            shutil.copy(r"{}/static/temDirectory/{}/{}".format(app.config['UPLOAD_FOLDER'],FolderNumber, fileName), filePath)
            # 递归删除一个目录以及目录里的所有内容
            shutil.rmtree(app.config['UPLOAD_FOLDER'] + "/static/temDirectory/" + FolderNumber)

            shutil.rmtree(filePagesPath)
            #### 存入需要打印上门文件夹

            # 存入用户上传的消息至userMessage
            # message = user.user_name + "您好，您上传的" + file_name + "的订单号是" + fileNumber + "您可以用此来下单。谢谢您的使用。"
            newMessage = userMessage(openId=openId, orderNumber=fileNumber, fileName=fileName, isReceive=False, time=upload_time)
            db.session.add(newMessage)
            db.session.commit()
            return jsonify(message="打印成功", money=str(moneyAll))
        else:
            return jsonify(message="文件已打印或文件编号错误", money="0")

    elif request.method=='GET':

        return ""

# 登录，获得信息
@app.route('/login', methods=["POST"])
def login():
    print (request.data)
    print (request.form)
    print (request.values)
    user_name = json.loads(request.data)["user_name"]
    # global openId
    # global session_key
    openId = json.loads(request.data)["openid"]
    session_key = json.loads(request.data)["session_key"]
    #user = User(user_name=user_name1, openId=openid, session_key=session_key)
    # db.session.add(user)
    # db.session.commit()
    # 对是否已经登陆过的用户进行判断
    user_old = User.query.filter_by(openId=openId).first()
    print (user_old)
    if (user_old):
        # 老用户直接提交
        db.session.add(user_old)
        db.session.commit()
    else:
        local_time = time.strftime('%Y%m%d%H%M%S', time.localtime(time.time()))[2:]
        directoryName = local_time  + str(random.randint(1000, 9999))
        print (directoryName)
        print (type(directoryName))
        user_new = User(user_name=user_name, openId=openId, session_key=session_key, university_name="", phoneNumber="", userDirectory=directoryName)
        db.session.add(user_new)
        db.session.commit()
    return "ok"

@app.route('/getUserInfo', methods=['POST'])
def getUserInfo():
    openId = json.loads(request.data)['openId']
    nickName = json.loads(request.data)['nickName']
    user = User.query.filter_by(openId=openId).first()
    user.user_name = nickName
    db.session.add(user)
    db.session.commit()
    return ""

# 获取手机号并存储
@app.route('/phoneNumber', methods=['POST'])
def getPhoneNumber():
    print (request.data)
    openId = json.loads(request.data)['openId']
    phoneNumber = json.loads(request.data)['phoneNumber']
    currentUser = User.query.filter_by(openId=openId).first()
    currentUser.phoneNumber = phoneNumber
    db.session.add(currentUser)
    db.session.commit()
    return ""

# 我的订单
@app.route('/personal_order', methods=['GET'])
def get_personal():
    openId = str(request.values['openId'])
    filename = []
    personal_file = File.query.filter_by(openId = openId).all()
    print(len(File.query.filter_by(openId = openId).all()))
    # print (personal_file[2].filename)
    for file in File.query.filter_by(openId = openId).all():
        filename.append(file.filename)
    print(filename)
    return jsonify(filename)

# 学校选择和获得学校信息
@app.route('/university_info', methods=['GET', 'POST'])
def university_info():

    if (request.method == 'GET'):
        openId = str(request.values['openId'])
        university_result = db.session.query(University.university_name).all() # 返回列表中数据的类型 <class 'sqlalchemy.util._collections.result'>， 转为String
        university_info = []

        for info in university_result:
            # 编码问题，中文的显示问题，并处理返回列表中的数据类型不能解码的问题
            info_string = str(info)
            # 切片索引提取学校的名字
            university_info.append(info_string[3:len(info_string)-3] )
       # print ("学校信息: ")
       # print (db.session.query(University.university_name))
       # print (len(university_info))
       # print (type(university_info[1]))
       # print (university_info[1][1])
       # print (chardet.detect(university_info[2]))
       # print (chardet.detect(university_result[1]))
       # print (university_info[2])
       # print (jsonify(university_info))
        return jsonify(university_info = university_info)
    else:
        openId = json.loads(request.data)['openId']
        User_info = User.query.filter_by(openId=openId).first()
        User_info.university_name = json.loads(request.data)['university']
        db.session.add(User_info)
        db.session.commit()
        print (json.loads(request.data)['university'])
        return ""

# 对是否已经录入学校信息的检查,已录入返回true（代表直接进入首页）否则进入学校选择界面。
@app.route('/check_university', methods=['GET'])
def check_university():
    # 获得openId
    openId = str(request.values['openId'])
    user_info = User.query.filter_by(openId=openId).first()
    if (user_info.university_name == ""):
        #return jsonify(resp=False)
        universityResp = False
    else:
        universityResp = True
    if (user_info.phoneNumber == ""):
        phoneNumberResp = False
    else:
        phoneNumberResp = True

    return jsonify(universityResp=universityResp, phoneNumberResp=phoneNumberResp)

# 我的消息
@app.route('/myMessage', methods=['GET'])
def get_message():
    # 获得openId
    # openId = json.loads(request.data)['openId']
    openId = str(request.values['openId'])
    currentUserMessage = userMessage.query.filter_by(openId=openId).order_by('time').all()
    # messageList = []
    fileNameList = []
    orderNumberList = []
    isReceiveList = []
    timeList = []
    for message in currentUserMessage:
        fileNameList.append(message.fileName)
        orderNumberList.append(message.orderNumber)
        isReceiveList.append(message.isReceive)
        timeList.append(message.time)
    # print (messageList)
    return  jsonify(fileNameList=fileNameList, orderNumberList=orderNumberList, isReceiveList=isReceiveList, timeList=timeList)

# 打印上门 prntToDoor响应
@app.route('/order_info', methods=['POST'])
def order_info():
    print (request.data)
    openId = json.loads(request.data)['openId']
    print(request.data)
    # 对用户输入的订单号进行检测
    print("订单信息")
    if (len(File.query.filter_by(fileNumber=json.loads(request.data)['order_number']).all()) != 0):
        print (File.query.filter_by(fileNumber=json.loads(request.data)['order_number']).first())
        # 判断此订单是否已经发布
        if (len(Print.query.filter_by(orderNumber=json.loads(request.data)['order_number']).all()) != 0):
            print (type(Print.query.filter_by(orderNumber=json.loads(request.data)['order_number'])) is None)
            return jsonify(info="此订单已上传,请勿重复上传", result=False)
        else:
            order_number = json.loads(request.data)['order_number']
            address_info = json.loads(request.data)['address_info']
            isReceive = json.loads(request.data)['isReceive']
            isPrint = False
            newPrintNeed = Print(openId=openId, orderNumber=order_number, address=address_info, isReceive=isReceive, isPrint=isPrint, phoneNumber="")
            db.session.add(newPrintNeed)
            db.session.commit()
            return jsonify(info="此订单上传成功", result=True)
    else:
        return jsonify(info="你输入的订单编号不规范，请重新上传。", result=False)

# pickUpOrders （我要接单）界面的响应函数
@app.route('/pickUpOrders', methods=['GET', 'POST'])
def pickUpOrders():

    if (request.method=='GET'):
        openId = str(request.values['openId'])
        fileListFromdb = Print.query.filter_by(isReceive=False).all()
        fileNumberList = []
        fileNameList = []
        addressList = []
        for file in fileListFromdb:
            fileNameList.append(File.query.filter_by(fileNumber=file.orderNumber).first().filename)
            fileNumberList.append(file.orderNumber)
            addressList.append(file.address)
            print (file.orderNumber)
        print (fileNameList)
        print (fileNumberList)
        return jsonify(fileNameList=fileNameList, fileNumberList=fileNumberList, addressList=addressList)
    else:
        print(request.data)
        # 接受传过来的数据
        openId = json.loads(request.data)['openId']
        orderNumber = json.loads(request.data)['fileNumber']
        isReceive = json.loads(request.data)['isReceive']
        time = json.loads(request.data)['time']

        # 做出对应的修改
        order = Print.query.filter_by(orderNumber=orderNumber).first()
        current_user = User.query.filter_by(openId=openId).first()
        phoneNumber = current_user.phoneNumber
        order.isReceive = True
        # 将当前用户的手机号码绑定到此订单。
        order.phoneNumber = phoneNumber
        RevOrder = userRevOrder(openId=openId, orderNumber=orderNumber)
        # 订单被接受，改变其状态
        db.session.add(order)
        db.session.commit()
        # 添加用户的接单信息
        db.session.add(RevOrder)
        db.session.commit()

        # 存入有用户接单的信息
        fileOwnerOpenId = order.openId
        file = File.query.filter_by(fileNumber=orderNumber).first()
        message = "有用户接受了您的订单。订单信息为：订单号：" + orderNumber + "文件名：" + file.filename + "该用户手机号为" + phoneNumber
        # isReceive是为了区分上传时的消息，和被接单时的消息
        newUserMessage = userMessage(openId=fileOwnerOpenId, orderNumber=orderNumber, fileName=file.filename, isReceive=isReceive, time=time)
        db.session.add(newUserMessage)
        db.session.commit()
        return ""

# 资料共享的界面的数据获取
@app.route('/getShareFile', methods=['GET', 'POST'])
def getShareFile():
    if (request.method == 'GET'):
        fileList = File.query.filter_by(ifShared=True).all()
        length = len(fileList)
        fileShareNameList = []
        fileNumberList = []
        fileOwnerOpenId = []
        for file in fileList:
            fileShareNameList.append(file.filename)
            fileNumberList.append(file.fileNumber)
            fileOwnerOpenId.append(file.openId)
        print (fileShareNameList)
        print (fileNumberList)
        print (fileOwnerOpenId)
        return jsonify(fileShareNameList=fileShareNameList, length=length, fileNumberList=fileNumberList, fileOwnerOpenId=fileOwnerOpenId)
    else:
        fileName = json.loads(request.data)['fileName']
        ownerOpenId = json.loads(request.data)['openId']
        fileNumber = json.loads(request.data)['fileNumber']
        print (fileName)
        print (ownerOpenId)
        print (fileNumber)
        print (os.path.join(app.config['UPLOAD_FOLDER']))
        return ""

#响应用户的下载需求
@app.route('/downLoad', methods=['GET'])
def download_file():
    print (request.values)
    openId = request.values['openId']
    fileNumber = request.values['fileNumber']
    fileName = request.values['fileName']
    print (openId)
    print (fileNumber)
    print (fileName)
    # 获取用户的文件夹
    user = User.query.filter_by(openId=openId).first()
    fileDirectory = user.userDirectory
    # 获取在后端文件所在的绝对路径
    downloadPath = "/static/" + fileDirectory + '/' + fileName
    #return send_from_directory(directory, fileName, as_attachment=True)
    # 将文件复制到Flask项目的static目录
    #shutil.copy(oldDirectory, directory)
    # 提供链接给用户下载
    return jsonify(Path='https://www.printgo.xyz' + downloadPath)



if __name__ == '__main__':
    app.run()
