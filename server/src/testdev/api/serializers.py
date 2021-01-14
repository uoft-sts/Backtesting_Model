from rest_framework import serializers
from testdev.models import Test

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ['title','content']

    