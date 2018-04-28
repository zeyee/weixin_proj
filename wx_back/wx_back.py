# -*- coding: utf-8 -*-
import os
from flask import Flask, request, url_for, send_from_directory, json, jsonify
from werkzeug import secure_filename
import os, sys, string
from flask_sqlalchemy import SQLAlchemy
import xlrd
import chardet

reload(sys)
sys.setdefaultencoding('utf-8')

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

openId = '';
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

class User(db.Model):
    __tablename__ = 'user_info'

    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(20))
    openId = db.Column(db.String(64), unique=True)
    session_key = db.Column(db.String(64), unique=True)
    university_name = db.Column(db.String(20))
    def __init__(self, user_name, openId, session_key, university_name):  # 插入新值的方法
        self.user_name = user_name
        self.openId = openId
        self.session_key = session_key
        self.university_name = university_name

    def __repr__(self):
        return '<User %r>' % self.name

class File(db.Model):
    __tablename__ = 'file_info'

    id = db.Column(db.Integer, primary_key=True)
    openId = db.Column(db.String(64))
    filename = db.Column(db.String(60))

    def __init__(self, openId, filename):  # 插入新值的方法
        self.openId = openId
        self.filename = filename

    def __repr__(self):
        return '<Role %r>' % self.name

class Order(db.Model):
    __tablename__ = 'order_info'

    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(60))

class University(db.Model):
    __tablename__ = 'university_names'

    id = db.Column(db.Integer, primary_key=True)
    university_name = db.Column(db.String(30), unique=True)

    def __init__(self, university_name):  # 插入新值的方法
        self.university_name = university_name



# 创建数据库表
# db.drop_all()
db.create_all()

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
        print (app.config['UPLOAD_FOLDER'] + "\\" + openId)
        if not folder:
            os.makedirs(app.config['UPLOAD_FOLDER'] + "\\" + openId)
        #print (request.values)
        print (request)
        print (request.form['FileDescribe'])
        print (request.values)
        # 获取传过来的文件
        file = request.files['picture']
        # 对同一用户的文件进行编号区分
        num = str(len(File.query.filter_by(openId=openId).all())+1)
        file_name = request.form['FileDescribe'] + file.filename[-4:]
        print (file.filename[-4:])
        print (file_name)
        file_info = File(openId=openId, filename=file_name)
        db.session.add(file_info)
        db.session.commit()
        a = File.query.filter_by(openId=openId).first()
        print (a.filename)
        print (a.openId)
        # 保存用户上传的文件至指定目录
        file.save(os.path.join(app.config['UPLOAD_FOLDER'] + "\\" + openId, file_name))
        #### 存入需要打印上门文件夹


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
        user_new = User(user_name=user_name, openId=openId, session_key=session_key, university_name="")
        db.session.add(user_new)
        db.session.commit()
    return "ok"

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
        return jsonify(resp=False)
    else:
        return jsonify(resp=True)

if __name__ == '__main__':
    app.run()
