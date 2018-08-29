from flask_restful import Resource, Api
import keras
from flask import Flask, request, render_template
from sklearn.externals import joblib
from flask_cors import CORS
import numpy as np
from scipy import misc
import tensorflow as tf
from keras.models import load_model
import os
import pandas as pd

app = Flask(__name__)
api= Api(app)
cors = CORS(app)
model = load_model('model.h5')
graph = tf.get_default_graph()

UPLOAD_FOLDER = "/home/uttam/PycharmProjects/ML"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
class Upload(Resource):

    def post(self):
        file = request.files['image']
        file.save(os.path.join(app.config['UPLOAD_FOLDER'])+"predict.jpg")


        return {"status": "ok"}

class Predict(Resource):

    def get(self):
        datas = []
        my_data = pd.read_csv('labels.csv',delimiter=',')
        test_image = misc.imread(os.path.join(app.config['UPLOAD_FOLDER'])+"predict.jpg", flatten=True)
        datas.append(test_image.flatten())
        x = np.array(datas)
        X_test = x
        X_test /= 255
        with graph.as_default():
            prediction = model.predict_classes(X_test)
            prediction_prob = model.predict_proba(X_test)
        label = int(np.squeeze(prediction))
        prob = np.squeeze(prediction_prob)
        probability = np.amax(prob)
        if label == '10': label = '0'

        return {"prediction": str(my_data.iloc[label, :].values[0]), "probability": float(probability)}


api.add_resource(Upload, '/upload')
api.add_resource(Predict, '/predict')

if __name__ == '__main__':
    app.run()