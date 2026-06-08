import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from users.models import User


@pytest.fixture
def api_client() -> APIClient:
    return APIClient()


@pytest.fixture
def user_data() -> dict[str, str]:
    return {
        "email": "test@example.com",
        "name": "Test User",
        "password": "SecurePass123!",
    }


@pytest.fixture
def registered_user(user_data: dict[str, str]) -> User:
    return User.objects.create_user(
        email=user_data["email"],
        name=user_data["name"],
        password=user_data["password"],
    )


@pytest.mark.django_db
class TestRegister:
    def test_register_success(
        self, api_client: APIClient, user_data: dict[str, str]
    ) -> None:
        url = reverse("register")
        response = api_client.post(url, user_data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["email"] == user_data["email"]
        assert response.data["name"] == user_data["name"]
        assert "password" not in response.data
        assert User.objects.filter(email=user_data["email"]).exists()

    def test_register_duplicate_email(
        self,
        api_client: APIClient,
        user_data: dict[str, str],
        registered_user: User,
    ) -> None:
        url = reverse("register")
        response = api_client.post(url, user_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "email" in response.data


@pytest.mark.django_db
class TestLogin:
    def test_login_success(
        self,
        api_client: APIClient,
        user_data: dict[str, str],
        registered_user: User,
    ) -> None:
        url = reverse("token_obtain_pair")
        response = api_client.post(
            url,
            {"email": user_data["email"], "password": user_data["password"]},
            format="json",
        )

        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data
        assert "refresh" in response.data

    def test_login_wrong_password(
        self,
        api_client: APIClient,
        user_data: dict[str, str],
        registered_user: User,
    ) -> None:
        url = reverse("token_obtain_pair")
        response = api_client.post(
            url,
            {"email": user_data["email"], "password": "WrongPassword123!"},
            format="json",
        )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestMe:
    def test_me_authenticated(
        self,
        api_client: APIClient,
        user_data: dict[str, str],
        registered_user: User,
    ) -> None:
        login_url = reverse("token_obtain_pair")
        login_response = api_client.post(
            login_url,
            {"email": user_data["email"], "password": user_data["password"]},
            format="json",
        )
        token = login_response.data["access"]

        url = reverse("me")
        response = api_client.get(url, HTTP_AUTHORIZATION=f"Bearer {token}")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["email"] == user_data["email"]
        assert response.data["name"] == user_data["name"]

    def test_me_unauthenticated(self, api_client: APIClient) -> None:
        url = reverse("me")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
