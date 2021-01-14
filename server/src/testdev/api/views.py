from rest_framework.generics import ListAPIView, RetrieveAPIView
from testdev.models import Test
from .serializers import TestSerializer

class TestListView(ListAPIView):
    queryset = Test.objects.all()
    serializer_class = TestSerializer

class TestDetailView(RetrieveAPIView):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
