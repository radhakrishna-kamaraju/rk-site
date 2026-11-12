"""Render resume.html to site/Radhakrishna-Kamaraju-Resume.pdf (needs: pip install playwright; playwright install chromium)."""
import pathlib
from playwright.sync_api import sync_playwright
here = pathlib.Path(__file__).resolve().parent
out = here.parent / "site" / "Radhakrishna-Kamaraju-Resume.pdf"
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    pg.goto((here / "resume.html").as_uri())
    pg.evaluate("document.fonts.ready")
    pg.pdf(path=str(out), format="A4", print_background=True, prefer_css_page_size=True)
    b.close()
print("wrote", out)
