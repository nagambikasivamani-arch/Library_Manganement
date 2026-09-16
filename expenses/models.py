from django.db import models
from django.contrib.auth.models import User


class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('Food', 'Food'),
        ('Travel', 'Travel'),
        ('Shopping', 'Shopping'),
        ('Bills', 'Bills'),
        ('Entertainment', 'Entertainment'),
        ('Education', 'Education'),
        ('Health', 'Health'),
        ('Other', 'Other'),
    ]

    user = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    related_name='expenses',
    null=True,
    blank=True
)
   

    title = models.CharField(max_length=100)

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES
    )

    date = models.DateField()

    description = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title