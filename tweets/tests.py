from django.contrib.auth import get_user_model
from django.test import TestCase
from .models import Tweet

User = get_user_model()


# Create your tests here.
class TweetTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='cfe', password='password')

    def test_user_created(self):
        self.assertEqual(self.user.username, 'cfe')
        self.assertEqual(1, 2)
