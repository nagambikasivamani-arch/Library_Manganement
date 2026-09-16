from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Expense


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class ExpenseSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Expense
        fields = [
            'id',
            'user',
            'title',
            'amount',
            'category',
            'date',
            'description',
            'created_at'
        ]