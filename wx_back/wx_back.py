# -*- coding: utf-8 -*-
import os
import random

import time
from flask import Flask, request, url_for, send_from_directory, json, jsonify
from werkzeug import secure_filename
import os, sys, string
from flask_sqlalchemy import SQLAlchemy
import xlrd
import chardet

reload(sys)
sys.setdefaultencoding('utf-8')

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])


app = Flask(__name__)
# 数据库的配置
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@127.0.0.1:3306/wx_info'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
# 文件保存目录的配置
app.config['UPLOAD_FOLDER'] = "C:\Users\wsc\Desktop"
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
# 实例化
db = SQLAlchemy(app, use_native_unicode='utf8')
session_key = '';
openId = '';

# 用户的数据库表
class User(db.Model):
    __tablename__ = 'user_info'

    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(20))
    openId = db.Column(db.String(64), unique=True)
    session_key = db.Column(db.String(64), unique=True)
    university_name = db.Column(db.String(20))
    phoneNumber = db.Column(db.String(12))

    def __init__(self, user_name, openId, session_key, university_name, phoneNumber):  # 插入新值的方法
        self.user_name = user_name
        self.openId = openId
        self.session_key = session_key
        self.university_name = university_name

    def __repr__(self):
        return '<Role %r>' % self.user_name
# 上传的文件的数据库表
class File(db.Model):
    __tablename__ = 'file_info'

    id = db.Column(db.Integer, primary_key=True)
    openId = db.Column(db.String(64))
    filename = db.Column(db.String(60))
    fileNumber = db.Column(db.String(40))
    isPrint = db.Column(db.Boolean)
    ifShared = db.Column(db.Boolean)

    def __init__(self, openId, filename, fileNumber, isPrint, ifShared):  # 插入新值的方法
        self.openId = openId
        self.filename = filename
        self.fileNumber = fileNumber
        self.isPrint = isPrint
        self.ifShared = ifShared

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
    message = db.Column(db.TEXT)

    def __init__(self, openId, message):
        self.openId = openId
        self.message = message

    def __repr__(self):
        return '<userMessage %r>' % self.id

# 创建数据库表
# db.drop_all()
db.create_all()
"""
html = '''
    <!DOCTYPE html>
    <title>Upload File</title>
    <h1>图片上传</h1>
    <form method=post enctype=multipart/form-data>
         <input type=file name=file>
         <input type=submit value=上传>
    </form>
    '''
"""
"""
#获得学校的列表并插入数据库
university_data = xlrd.open_workbook(r"C:\Users\wsc\Desktop\\xxx.xls")
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
"""


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)


""""@app.route('/', methods=['GET', 'POST'])
def upload_file1():
    if request.method == 'POST':
        print (request)
        print (request.form)
        print (request.values)
        # print (request.content)
        print (request.files)
        file = request.files['picture']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            #file_url = url_for('uploaded_file', filename=filename)
            return html
    return html
"""
# 上传文件
@app.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        global session_key
        global openId
        ##### 存入用户文件夹
        # 不同用户单独文件夹存放文件
        folder = os.path.exists(app.config['UPLOAD_FOLDER'] + "\\" + openId)
        # openId 来标识用户的文件夹
        print (app.config['UPLOAD_FOLDER'] + "\\" + openId)
        if not folder:
            os.makedirs(app.config['UPLOAD_FOLDER'] + "\\" + openId)
        #print (request.values)
        print (request)
        print (request.files)
        print (type(request.form))
        # print (request.form['FileDescribe'])
        # print (request.values)
        # 获取传过来的文件
        file = request.files['picture']
        # 对同一用户的文件进行编号区分
        FileDescribe = request.form['FileDescribe']
        ifShared = request.form['ifShared']
        if (ifShared=='False'):
            ifShared = False
        else:
            ifShared = True
        print (ifShared)
        print (request.form)
        # file.filename[-4:] 从前端传来的文件名中提取扩展名
        file_name = FileDescribe + file.filename[-4:]
        #print (file.filename[-4:])
        #print (file_name)
        # 文件编号的生成 利用当前时间和用户id和一个随机生成的4位数
        local_time = time.strftime('%Y%m%d%H%M%S', time.localtime(time.time()))[2:]
        user = User.query.filter_by(openId = openId).first()
        id = user.id
        fileNumber = local_time + str(id) + str(random.randint(1000, 9999))
        ### 文件存入数据库
        file_info = File(openId=openId, filename=file_name, fileNumber=fileNumber, isPrint=False, ifShared=ifShared)
        db.session.add(file_info)
        db.session.commit()
        ### 将文件存入目录
        a = File.query.filter_by(openId=openId).first()
        # print (a.filename)
        # print (a.openId)
        # 保存用户上传的文件至指定用户目录
        file.save(os.path.join(app.config['UPLOAD_FOLDER'] + "\\" + openId, file_name))
        #### 存入需要打印上门文件夹

        # 存入用户上传的消息至userMessage
        message = user.user_name + "您好，您上传的" + file_name + "的订单号是" + fileNumber + "您可以用此来下单。谢谢您的使用。"
        newMessage = userMessage(openId=openId, message=message)
        db.session.add(newMessage)
        db.session.commit()


        return "上传成功"

# 登录，获得信息
@app.route('/login', methods=["POST"])
def login():
    print (request.data)
    print (request.form)
    print (request.values)
    user_name = json.loads(request.data)["user_name"]
    global openId
    global session_key
    openId = json.loads(request.data)["openid"]
    session_key = json.loads(request.data)["session_key"]
    #user = User(user_name=user_name1, openId=openid, session_key=session_key)
    # db.session.add(user)
    # db.session.commit()
    # 对是否已经登陆过的用户进行判断
    user_old = User.query.filter_by(openId=openId).first()
    if (user_old):
        # 更新nickName
        user_old.user_name = user_name
        db.session.add(user_old)
        db.session.commit()
        print (type(user_old))
        print (user_old.id)
        print (user_old.user_name)
        print (user_old.openId)
    else:
        user_new = User(user_name=user_name, openId=openId, session_key=session_key, university_name="", phoneNumber="")
        db.session.add(user_new)
        db.session.commit()
    return "ok"

# 获取手机号并存储
@app.route('/phoneNumber', methods=['POST'])
def getPhoneNumber():
    print (request.data)
    global openId
    phoneNumber = json.loads(request.data)['phoneNumber']
    currentUser = User.query.filter_by(openId=openId).first()
    currentUser.phoneNumber = phoneNumber
    db.session.add(currentUser)
    db.session.commit()
    return ""

# 我的订单
@app.route('/personal_order', methods=['GET'])
def get_personal():
    global openId
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
    global openId
    if (request.method == 'GET'):
        university_result = db.session.query(University.university_name).all() # 返回列表中数据的类型 <class 'sqlalchemy.util._collections.result'>， 转为String
        university_info = []

        for info in university_result:
            # 编码问题，中文的显示问题，并处理返回列表中的数据类型不能解码的问题
            info_string = str(info).decode('unicode_escape').encode('utf-8')
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
    global openId
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
    global openId
    currentUserMessage = userMessage.query.filter_by(openId=openId).all()
    messageList = []
    for message in currentUserMessage:
        messageList.append(message.message)
    # print (messageList)
    return  jsonify(messageList=messageList)

# 打印上门 prntToDoor响应
@app.route('/order_info', methods=['POST'])
def order_info():
    global openId
    print
    print(request.data)
    # 对用户输入的订单号进行检测
    if (File.query.filter_by(fileNumber=json.loads(request.data)['order_number'])):
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
    global openId
    if (request.method=='GET'):
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
        orderNumber = json.loads(request.data)['fileNumber']
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
        newUserMessage = userMessage(openId=fileOwnerOpenId, message=message)
        db.session.add(newUserMessage)
        db.session.commit()
        return ""

# 资料共享的界面的数据获取
@app.route('/getShareFile', methods=['GET'])
def getShareFile():
    fileList = File.query.filter_by(ifShared=True).all()
    length = len(fileList)
    fileShareNameList = []
    for file in fileList:
        fileShareNameList.append(file.filename)
    print (fileShareNameList)
    return jsonify(fileShareNameList=fileShareNameList, length=length)


if __name__ == '__main__':
    app.run()
