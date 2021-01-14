from django.urls import path

from .views import TestListView, TestDetailView

urlpatterns = [
    path('',TestListView.as_view()),
    path('<pk>',TestDetailView.as_view())
]