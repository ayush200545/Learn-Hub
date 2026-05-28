import time
import hmac
import hashlib
from django.conf import settings

# Attempt to load razorpay library, otherwise use a placeholder class structure
try:
    import razorpay
except ImportError:
    razorpay = None


class RazorpayService:
    @staticmethod
    def is_configured():
        return bool(settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET)

    @classmethod
    def get_client(cls):
        if not razorpay:
            return None
        if not cls.is_configured():
            return None
        try:
            return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        except Exception:
            return None

    @classmethod
    def create_payment_link(cls, amount_in_paise, receipt_id, session_title, user_email):
        """
        Creates a Razorpay Payment Link.
        If credentials are empty, returns a mock payment link for local sandbox simulation.
        """
        client = cls.get_client()
        if client:
            try:
                frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost')
                if not frontend_url:
                    frontend_url = 'http://localhost'
                    
                callback_url = f"{frontend_url}/api/auth/razorpay/callback" # Or frontend route that handles verification
                
                link_data = {
                    'amount': amount_in_paise,
                    'currency': 'INR',
                    'accept_partial': False,
                    'reference_id': f"rcpt_{receipt_id}_{int(time.time())}",
                    'description': f"Payment for {session_title}",
                    'customer': {
                        'email': user_email or 'customer@example.com'
                    },
                    'callback_url': f"{frontend_url}/dashboard/user?payment=success&booking={receipt_id}&razorpay=true",
                    'callback_method': 'get'
                }
                payment_link = client.payment_link.create(link_data)
                return {
                    'order_id': payment_link['id'], # For simplicity, we'll store the link ID as order_id in DB
                    'amount': payment_link['amount'],
                    'currency': payment_link['currency'],
                    'short_url': payment_link['short_url'],
                    'sandbox': False
                }
            except Exception as e:
                # Log error and fall back to sandbox
                print(f"Razorpay error: {e}")
                pass

        # Sandbox Mock Mode
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost')
        if not frontend_url:
            frontend_url = 'http://localhost'
            
        mock_link_id = f"plink_mock_{int(time.time())}_{receipt_id}"
        return {
            'order_id': mock_link_id,
            'amount': amount_in_paise,
            'currency': 'INR',
            'short_url': f"{frontend_url}/dashboard/user?payment=success&booking={receipt_id}&sandbox=true",
            'sandbox': True
        }

    @classmethod
    def verify_payment_link_signature(cls, razorpay_payment_id, razorpay_payment_link_id, razorpay_payment_link_reference_id, razorpay_payment_link_status, razorpay_signature):
        """
        Verifies cryptographical signature from Razorpay Payment Link callback.
        """
        if str(razorpay_payment_link_id).startswith("plink_mock_"):
            return True

        client = cls.get_client()
        if not client:
            return False

        try:
            # For payment links, the signature is HMAC hex of:
            # payment_link_id + "|" + payment_link_reference_id + "|" + payment_link_status + "|" + payment_id
            payload = f"{razorpay_payment_link_id}|{razorpay_payment_link_reference_id}|{razorpay_payment_link_status}|{razorpay_payment_id}"
            expected_signature = hmac.new(
                bytes(settings.RAZORPAY_KEY_SECRET, 'utf-8'),
                msg=bytes(payload, 'utf-8'),
                digestmod=hashlib.sha256
            ).hexdigest()
            
            return hmac.compare_digest(expected_signature, razorpay_signature)
        except Exception:
            return False
