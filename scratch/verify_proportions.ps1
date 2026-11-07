Add-Type -AssemblyName System.Drawing

$pOff = "C:\Users\ademt\.gemini\antigravity\brain\11c050c8-ba29-4ba2-8993-d5396547a6f8\.user_uploaded\media_1793458841770_6f26b8f6.jpg"
$bmpOff = [System.Drawing.Bitmap]::FromFile($pOff)

# In Official screenshot (1024 x 575):
# Content area is from y=48 (under browser bar) to y=542 (top of footer)
$contentH = 542 - 48
Write-Host "Total Content Area Height in Official: $contentH px"

# Collage in Official:
# Top of collage: y=70 (70 - 48 = 22px from content top)
# Bottom of collage: y=492 (542 - 492 = 50px from footer)
# Collage height = 492 - 70 = 422px
Write-Host "Collage Top from Content Top: $(70 - 48)px"
Write-Host "Collage Bottom from Footer: $(542 - 492)px"
Write-Host "Collage Total Height: $(492 - 70)px"

# Collage Width in Official:
# Left edge of cooler: x=202
# Right edge of heart: x=537
# Total Width = 537 - 202 = 335px
Write-Host "Collage Total Width: $(537 - 202)px"

# Divider line in Official is at x=580:
Write-Host "Gap between Collage and Divider: $(580 - 537)px"

$bmpOff.Dispose()

