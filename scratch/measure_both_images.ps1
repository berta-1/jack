Add-Type -AssemblyName System.Drawing

$pLoc = "C:\Users\ademt\.gemini\antigravity\brain\11c050c8-ba29-4ba2-8993-d5396547a6f8\.user_uploaded\media_1793461080779_cc821235.jpg"
$pOff = "C:\Users\ademt\.gemini\antigravity\brain\11c050c8-ba29-4ba2-8993-d5396547a6f8\.user_uploaded\media_1793461108029_69cb71cc.jpg"

$bLoc = [System.Drawing.Bitmap]::FromFile($pLoc)
$bOff = [System.Drawing.Bitmap]::FromFile($pOff)

Write-Host "Local:    $($bLoc.Width) x $($bLoc.Height)"
Write-Host "Official: $($bOff.Width) x $($bOff.Height)"

# FB Logo in Official vs Local
function Get-Logo-Diameter($b) {
    $minX = 999; $maxX = 0; $minY = 999; $maxY = 0
    for ($y = 70; $y -lt 160; $y++) {
        for ($x = 20; $x -lt 90; $x++) {
            $p = $b.GetPixel($x, $y)
            if ($p.B -gt 180 -and $p.R -lt 50) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    return "X: $minX..$maxX (W=$($maxX-$minX+1)), Y: $minY..$maxY (H=$($maxY-$minY+1))"
}

Write-Host "FB Logo Official: $(Get-Logo-Diameter $bOff)"
Write-Host "FB Logo Local:    $(Get-Logo-Diameter $bLoc)"

# Collage in Official vs Local
function Get-Collage-Rect($b) {
    $minX = 999; $maxX = 0; $minY = 999; $maxY = 0
    # Search in x: 190..560, y: 60..520
    for ($y = 60; $y -lt 520; $y++) {
        for ($x = 190; $x -lt 560; $x++) {
            $p = $b.GetPixel($x, $y)
            # Not white
            if ($p.R -lt 240 -or $p.G -lt 240 -or $p.B -lt 240) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    return "X: $minX..$maxX (W=$($maxX-$minX+1)), Y: $minY..$maxY (H=$($maxY-$minY+1))"
}

Write-Host "Collage Official: $(Get-Collage-Rect $bOff)"
Write-Host "Collage Local:    $(Get-Collage-Rect $bLoc)"

# Login Card Button Width
function Get-Button-Width($b) {
    $minX = 999; $maxX = 0
    for ($y = 360; $y -lt 405; $y++) {
        for ($x = 600; $x -lt 960; $x++) {
            $p = $b.GetPixel($x, $y)
            if ($p.R -ge 225 -and $p.R -le 246 -and $p.G -ge 225 -and $p.G -le 246) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
            }
        }
    }
    return "X: $minX..$maxX (W=$($maxX-$minX+1))"
}

Write-Host "Button Official: $(Get-Button-Width $bOff)"
Write-Host "Button Local:    $(Get-Button-Width $bLoc)"

$bLoc.Dispose()
$bOff.Dispose()

